import React from "react";
import { Button, Navbar, Nav, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";

function Header({ isLoggedIn, handleLogout }) {
  return (
    <>
      <Navbar className="bg-primary px-5" variant="dark" expand="md">
        <Container fluid>
          <Navbar.Brand href="#home">Climate Bowl</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-end"
          >
            {isLoggedIn && (
              <>
                {/* <Nav.Link as={NavLink} to="/pcf-tracking">
                  PCF Tracking
                </Nav.Link> */}
                {/* <Nav.Link as={NavLink} to="/energy-efficiency-models">
                    Energy Efficiency Models
                  </Nav.Link> */}
              </>
            )}
            {isLoggedIn ? (
              <Button variant="danger" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Nav.Link as={NavLink} to="/login">
                <Button variant="light">Login</Button>
              </Nav.Link>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
