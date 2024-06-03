import React from "react";
import { Button, Navbar, Container, Nav } from "react-bootstrap";

function Header({ handleLogout }) {
  return (
    <>
      <Navbar className="bg-primary px-5" variant="dark" expand="md">
        <Container fluid>
          <Navbar.Brand href="#home">Climate Bowl</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Button variant="danger" onClick={handleLogout}>
              Logout
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
