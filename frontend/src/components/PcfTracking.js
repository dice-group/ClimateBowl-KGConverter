import React, { useState } from "react";
import TableComponent from "./TableComponent";
import { Container, Row, Col, Button } from "react-bootstrap";
import sendQuery from "./../utils/api";
import LebenszyklusPhase from "./charts/lebenszyklusphase";
import Scopes from "./charts/scopes";
import FormComponent from "./FormComponent";
import logo from "./../utils/images/logo.jpg";
import { useNavigate } from "react-router-dom";
function PcfTracking() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [query, setQuery] = useState("");

  const handleSubmit = async (query) => {
    try {
      sendQuery(query).then((newData) => {
        setData(JSON.parse(JSON.stringify(newData)));
        setOriginalData(JSON.parse(JSON.stringify(newData)));
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updatePCFValue = (pcfDataRow, index) => {
    data[index] = pcfDataRow;
    setData([...data]);
  };
  const handleNavigate = () => {
    // Filter data with scope 3
    navigate("/energy-efficiency-models", { state: data });
  };
  if (data.length === 0 && query === "") {
    const queryValue = `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX : <http://w3id.org/dice-research/climatebowl/ontology#>
    PREFIX clbr: <http://w3id.org/dice-research/climatebowl/resource#>
      
      SELECT ?company ?processModule ?category ?Allocation ?scope ?lifecyclePhase ?flow ?value  ?unit ?emissionsfactor ?region ?year ((?emissionsfactor * ?value) AS ?result)
      WHERE {
      ?flowR  :lifecyclePhase ?lifecyclePhase ;
                 :resulingQuantityPerReferenceFlow ?resultierendeMenge ;
                 :hasCategory ?category;
                 :scope ?scope ;
                 :resulingQuantityPerReferenceFlow ?value ;
                 :resulingQuantityPerReferenceFlowUnit ?unit ;
                 :allocationValueChain ?Allocation ;
                 :hasEmissionsfactor ?emissionsfactorR .
        ?emissionsfactorR :emissionfactor ?emissionsfactor ;
                            :land ?region;
             :year ?year.
      ?category rdfs:label ?flow.
      ?subject ?predicate ?flowR .
      ?subject :processmodule ?processModule .
  	?company a :Company;
  				rdfs:label "company1";
  				:hasProduct ?product.
  	?product a :Product;
               rdfs:label "product1".
  ?product :hasProcess ?subject.

    }`;
    if (query === "") setQuery(queryValue);
    handleSubmit(queryValue).then(() => {
      console.log("data updated successfully");
    });
  }

  return (
    <>
      <main className="m-2">
        <Container fluid>
          <h4>Sparql Query Field</h4>
          <hr></hr>
          <FormComponent onSubmit={handleSubmit} queryValue={query} />
          {data.length !== 0 && (
            <TableComponent
              data={data}
              originalData={originalData}
              updatePCFValue={updatePCFValue}
            />
          )}
        </Container>
        <Container>
          <Row className="justify-content-md-center">
            <LebenszyklusPhase
              data={data}
              originalData={originalData}
            ></LebenszyklusPhase>
          </Row>
          <Row className="justify-content-md-center">
            <Scopes data={data} originalData={originalData}></Scopes>
          </Row>
        </Container>
        {/* <Container fluid>
          <Row className="justify-content-md-center mt-4">
            <Button variant="primary" onClick={handleNavigate}>
              Go to Energy Efficiency Models
            </Button>
          </Row>
        </Container> */}
      </main>
    </>
  );
}
export default PcfTracking;
