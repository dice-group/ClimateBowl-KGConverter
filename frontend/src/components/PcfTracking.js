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
    PREFIX : <https://climatebowl.data.dice-research.org/ontology/>
    PREFIX clbr: <https://climatebowl.data.dice-research.org/resource/>
      
      SELECT ?company ?processModule ?kategorie ?zuordung ?scope ?lebenszyklusphase ?fluss ?menge  ?unit ?emissionsfaktor ?region ?year ((?emissionsfaktor * ?menge) AS ?result)
      WHERE {
      ?flussR  :lebenszyklusphase ?lebenszyklusphase ;
                 :resultierendeMengejeJeReferenzfluss ?resultierendeMenge ;
                 :hatKategorie ?kategorie;
                 :scope ?scope ;
                 :resultierendeMengejeJeReferenzfluss ?menge ;
                 :einheitResultierendeMengejeJeReferenzfluss ?unit ;
                 :zuordnungWertschöpfungskette ?zuordung ;
                 :hatEmissionsfaktor ?emissionsfaktorR .
        ?emissionsfaktorR :emissionsfaktor ?emissionsfaktor ;
                            :land ?region;
             :jahr ?year.
      ?kategorie rdfs:label ?fluss.
      ?subject ?predicate ?flussR .
      ?subject :prozessmodul ?processModule .
  	?company a :Company;
  				rdfs:label "company1";
  				:hatProduct ?product.
  	?product a :Product;
               rdfs:label "product1".
  ?product :hatProzess ?subject.

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
