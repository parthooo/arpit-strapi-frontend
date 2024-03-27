/* eslint-disable react/prop-types */
import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Layout( {children} ) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', maxWidth: '375px', margin: '0px auto', border: '1px solid #717171' }} >
      <Navbar bg="light" variant="light" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">Simple</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="ml-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/article-series">Article Series</Nav.Link>
              <Nav.Link as={Link} to="/bookmark">Bookmark</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* <Container style={{ flex: '1' }} >
        <main>{children}</main>
      </Container> */}

      <main style={{ flex: "1" }}>
        {children}
      </main>


      <footer className="bg-light text-dark text-center py-3">
        <Container>
          <p>&copy; {new Date().getFullYear()} My App. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  );
}

export default Layout;
