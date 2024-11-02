import QRCodeComponent from "@/shared/components/layout/QRCodeContainer";
import useModalStore from "@/shared/store/useModal";
import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

interface Props {
  qrCodeSrc: string;
  invoiceLink: string;
}
const InvoiceConfirmation: React.FC<Props> = ({ qrCodeSrc, invoiceLink }) => {
  const { dismiss } = useModalStore();
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title>Invoice Generated Successfully!</Card.Title>
              <Card.Text>
                Your invoice has been successfully generated. You can find it in
                your download folder.
              </Card.Text>

              <div className="text-center">
                <h5>Scan the QR code to access your invoice:</h5>
                <div
                  style={{ width: "200px", height: "200px", margin: "0 auto" }}
                >
                  <QRCodeComponent value={qrCodeSrc} />
                </div>
                <p>
                  <a
                    href={invoiceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Click here to view your invoice
                  </a>
                </p>
              </div>

              <Card.Text className="mt-4 text-muted">
                Note: Please check your download folder for the invoice file.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Button
            className="w-100 mt-3"
            variant="outline-dark"
            onClick={() => window.print()}
          >
            Print this page
          </Button>
          <Button
            className="w-100 mt-3"
            variant="dark"
            onClick={() => dismiss()}
          >
            Close dialog
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default InvoiceConfirmation;
