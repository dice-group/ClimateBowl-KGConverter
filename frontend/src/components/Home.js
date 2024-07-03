import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import logo from "./../utils/images/logo.jpg";

function Home() {
  return (
    <>
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
    </>
  );
}
export default Home;
