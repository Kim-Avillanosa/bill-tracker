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
          <div >
            <img src="/logo.png" className="w-50" />
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto" />
          <Nav className="justify-content-end">
            <Nav.Item>
              <Button 
                className="m-1 text-start w-100"
                variant="light"
                onClick={() => {
                  router.push("/");
                  dismiss();
                }}
              >
                <small>Logout ({currentAccount?.userName})</small>
              </Button>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppBar;
