import useAuthStore from "@/shared/store/useAuthStore";
import React from "react";
import { Button, Navbar, Nav, Container } from "react-bootstrap";
import { useRouter } from "next/router";

const AppBar: React.FC = () => {
  const { dismiss, currentAccount } = useAuthStore();

  const router = useRouter();

  return (
    <Navbar expand="lg">
      <Container>
        <Navbar.Brand>
          <strong>Bill tracker </strong> 💸
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto" />
          <Nav className="justify-content-end">
            <Nav.Item>
              <Button
                className="m-1"
                variant="outline-dark"
                onClick={() => {
                  router.push("/");
                  dismiss();
                }}
              >
                Logout ({currentAccount?.userName})
              </Button>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppBar;
