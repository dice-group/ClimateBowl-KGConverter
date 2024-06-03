import React, { useState } from "react";
import TableComponent from "./TableComponent";
import Header from "./Header";
import Footer from "./Footer";
import { Container, Row, Col } from "react-bootstrap";
import sendQuery from "./../utils/api";
import LebenszyklusPhase from "./charts/lebenszyklusphase";
import Scopes from "./charts/scopes";
import FormComponent from "./FormComponent";
import logo from "./../utils/images/logo.jpg";

function Home({ handleLogout }) {
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
  				rdfs:label "miele";
  				:hatProduct ?product.
  	?product a :Product;
               rdfs:label "washmachine".
  ?product :hatProzess ?subject.

    }`;
    if (query === "") setQuery(queryValue);
    handleSubmit(queryValue).then(() => {
      console.log("data updated successfully");
    });
  }

  return (
    <>
      <Header handleLogout={handleLogout}></Header>
      <Container fluid>
        <Row>
          <Col md={5}>
            {/* Left side - Logo */}
            <div className="logo-container">
              {/* Place your logo or any content here */}
              <img
                src={logo}
                alt="Logo"
                className="logo"
                style={{ width: "100%" }}
              />
            </div>
          </Col>
          <Col md={7}>
            {/* Right side - Quote */}
            <div className="quote-container">
              <h3>ClimatebOWL</h3>
              <h4>"- Climate neutral business in Ostwestfalen-Lippe"</h4>
            </div>
          </Col>
        </Row>
      </Container>
      <main className="m-5">
        <Container fluid>
          <h2>Sparql Query Field</h2>
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
        <Container fluid>
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
      </main>
      {/* <Footer></Footer> */}
    </>
  );
}
export default Home;
