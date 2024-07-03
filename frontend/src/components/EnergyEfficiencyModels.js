import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Accordion, Button, Form, Modal, Alert, Table } from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const EnergyEfficiencyModels = () => {
  const location = useLocation();
  const originalData = location.state;

  const [showModal, setShowModal] = useState(false);
  const [currentProcessIndex, setCurrentProcessIndex] = useState(null);
  const [modelData, setModelData] = useState([]);
  const [apiData, setApiData] = useState({});
  const [selectedModel, setSelectedModel] = useState("");
  const [jsonInput, setJsonInput] = useState("");
  const [isNOP, setIsNOP] = useState(false);
  const [modelName, setModelName] = useState("");
  const [validationError, setValidationError] = useState("");
  const [energyEfficiencyResults, setEnergyEfficiencyResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/available_models/",
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setApiData(response.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();
  }, []);

  const data = originalData.filter(
    (item) =>
      (item.scope.startsWith("2") || item.scope.startsWith("1")) &&
      item.lebenszyklusphase === "Produktion"
  );

  if (!data || data.length === 0) {
    return <h2>No data available</h2>;
  }

  const handleShow = (index) => {
    setCurrentProcessIndex(index);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setCurrentProcessIndex(null);
    setSelectedModel("");
    setJsonInput("");
    setIsNOP(false);
    setModelName("");
    setValidationError("");
  };

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
    setJsonInput("");
    setIsNOP(false);
    setModelName("");
    setValidationError("");
  };

  const handleJsonInputChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleIsNOPChange = (e) => {
    setIsNOP(e.target.value === "true");
  };

  const handleNameChange = (e) => {
    setModelName(e.target.value);
  };

  const validateJsonInput = (input, parameterList) => {
    try {
      const jsonData = JSON.parse(input);
      const missingParams = Object.keys(parameterList).filter(
        (param) => !(param in jsonData)
      );
      if (missingParams.length > 0) {
        return `Missing parameters: ${missingParams.join(", ")}`;
      }
      return null;
    } catch (error) {
      return "Invalid JSON format";
    }
  };

  const handleSave = () => {
    // Extract the category and model details
    let modelCategory = "";
    let modelDetails = null;

    for (const [category, models] of Object.entries(apiData)) {
      for (const model of Object.values(models)) {
        if (model.cls_name === selectedModel) {
          modelDetails = model;
          modelCategory = category;
          break;
        }
      }
      if (modelDetails) break;
    }
    console.log(modelDetails, modelCategory);
    if (modelDetails) {
      const validationError = validateJsonInput(
        jsonInput,
        modelDetails.parameter_list
      );
      if (validationError) {
        setValidationError(validationError);
      } else {
        setModelData((prevData) => {
          const updatedData = [...prevData];
          if (!updatedData[currentProcessIndex]) {
            updatedData[currentProcessIndex] = [];
          }
          updatedData[currentProcessIndex].push({
            name: modelName || selectedModel,
            category: modelCategory,
            cls_name: modelDetails.cls_name,
            is_NOP: isNOP,
            params: JSON.parse(jsonInput),
          });
          return updatedData;
        });
        handleClose();
      }
    }
  };

  const handleDelete = (processIndex, modelIndex) => {
    setModelData((prevData) => {
      const updatedData = [...prevData];
      updatedData[processIndex].splice(modelIndex, 1);
      return updatedData;
    });
  };

  const modelOptions = Object.values(apiData)
    .flatMap((category) => Object.values(category))
    .map((model) => (
      <option key={model.cls_name} value={model.cls_name}>
        {model.display_name}
      </option>
    ));

  const calculateEnergyEfficiency = async () => {
    try {
      const results = [];
      for (const models of modelData) {
        console.log(models);
        const response = await axios.post(
          "http://localhost:8000/model_list/get_all_energy_demands",
          models
        );
        results.push(response.data);
      }

      // Add process names to the results
      const resultsWithProcessNames = results.map((result, index) => ({
        ...result,
        processName: data[index]?.processModule || `Process ${index + 1}`,
      }));
      setEnergyEfficiencyResults(resultsWithProcessNames);
    } catch (error) {
      console.error("Error calculating energy efficiency: ", error);
    }
  };

  return (
    <div>
      <h2>Energy Efficiency Models</h2>
      <Accordion defaultActiveKey="0">
        {data.map((item, index) => (
          <Accordion.Item eventKey={String(index)} key={index}>
            <Accordion.Header>{item.processModule}</Accordion.Header>
            <Accordion.Body>
              <Button variant="primary" onClick={() => handleShow(index)}>
                Add Model
              </Button>
              {modelData[index] && modelData[index].length > 0 && (
                <ul>
                  {modelData[index].map((model, i) => (
                    <li key={i}>
                      {model.name} - {Object.keys(model.params).join(", ")}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(index, i)}
                        style={{ marginLeft: "10px" }}
                      >
                        Delete
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
      <Button
        variant="success"
        onClick={calculateEnergyEfficiency}
        style={{ marginTop: "20px" }}
      >
        Calculate Energy Efficiency
      </Button>
      {energyEfficiencyResults.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Energy Efficiency Results</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Process Name</th>
                <th>Minimum Energy Demand</th>
                <th>Loss Energy Demand</th>
                <th>Peripheral Energy Demand</th>
                <th>Total Energy Demand</th>
              </tr>
            </thead>
            <tbody>
              {energyEfficiencyResults.map((result, index) => (
                <tr key={index}>
                  <td>{result.processName}</td>
                  <td>
                    {result.minimum_energy_demand.value}{" "}
                    {result.minimum_energy_demand.unit}
                  </td>
                  <td>
                    {result.loss_energy_demand.value}{" "}
                    {result.loss_energy_demand.unit}
                  </td>
                  <td>
                    {result.peripheral_energy_demand.value}{" "}
                    {result.peripheral_energy_demand.unit}
                  </td>
                  <td>
                    {result.total_energy_demand.value}{" "}
                    {result.total_energy_demand.unit}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Model</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="selectModel">
              <Form.Label>Select Model</Form.Label>
              <Form.Control
                as="select"
                value={selectedModel}
                onChange={handleModelChange}
              >
                <option value="">-- Select Model --</option>
                {modelOptions}
              </Form.Control>
            </Form.Group>
            {selectedModel && (
              <>
                <Form.Group controlId="modelName">
                  <Form.Label>Model Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={modelName}
                    onChange={handleNameChange}
                    placeholder="Enter model name"
                  />
                </Form.Group>
                <Form.Group controlId="jsonInput">
                  <Form.Label>Enter JSON</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={10}
                    value={jsonInput}
                    onChange={handleJsonInputChange}
                    placeholder="Enter JSON data here"
                  />
                  {validationError && (
                    <Alert variant="danger">{validationError}</Alert>
                  )}
                </Form.Group>
                <Form.Group controlId="isNOP">
                  <Form.Label>Is NOP?</Form.Label>
                  <Form.Check
                    type="radio"
                    name="isNOP"
                    id="isNOPYes"
                    label="Yes"
                    value={true}
                    checked={isNOP === true}
                    onChange={handleIsNOPChange}
                  />
                  <Form.Check
                    type="radio"
                    name="isNOP"
                    id="isNOPNo"
                    label="No"
                    value={false}
                    checked={isNOP === false}
                    onChange={handleIsNOPChange}
                  />
                </Form.Group>
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EnergyEfficiencyModels;
