import React from "react";
import { Container } from "react-bootstrap";

function Footer() {
  return (
    <footer className="justify-content-center">
      {/* Add your footer content here */}
      <Container fluid>
        <p className="justify-content-center">
          &copy; {new Date().getFullYear()} Climate Bowl
        </p>
      </Container>
    </footer>
  );
}

export default Footer;
