import React from "react";
import { Container, Row, Col } from "react-bootstrap";

function Footer() {
  return (
    <footer className="footer mt-auto py-3 bg-light">
      <Container>
        <Row className="justify-content-center">
          <Col className="text-center">
            <p>&copy; {new Date().getFullYear()} Climate Bowl</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
