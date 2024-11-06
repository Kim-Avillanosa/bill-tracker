import useInvoice from "@/services/useInvoice";
import CurrencyConverterLabel from "@/shared/components/layout/CurrencyConverterLabel";
import QRCodeComponent from "@/shared/components/layout/QRCodeContainer";
import React, { useCallback, useEffect, useState } from "react";
import { Card, Spinner, Alert, Row, Col, Badge, Container } from "react-bootstrap";
import {
  FaDollarSign,
  FaCalendarAlt,
  FaInfoCircle,
  FaCheckCircle,
  FaClock,
  FaRegCheckCircle,
} from "react-icons/fa";
import ReceiveInvoiceButton from "./ReceiveInvoiceButton";

interface InvoiceDetailsProps {
  invoiceId: number;
  client: Models.Client;
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({
  client,
  invoiceId,
}) => {
  const { fetchInvoiceById } = useInvoice();
  const [invoice, setInvoice] = useState<Models.Invoice | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadInvoiceDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchInvoiceById(invoiceId);
      setInvoice(response.data);
    } catch (err) {
      setError("Failed to load invoice details.");
      console.error("Error fetching invoice:", err);
    } finally {
      setLoading(false);
    }
  }, [invoiceId]);

  useEffect(() => {
    if (invoiceId) {
      loadInvoiceDetails();
    }
  }, [invoiceId, loadInvoiceDetails]);


  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!invoice) {
    return <Container className="text-center mt-5">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </Container>
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <FaClock />; // Clock icon for pending
      case "released":
        return <FaCheckCircle />; // Check circle icon for released
      case "received":
        return <FaRegCheckCircle />; // Regular check circle for received
      default:
        return null; // No icon for unknown status
    }
  };

  const calculateTotalAmount = (workitems: Models.WorkItem[]): number => {
    return workitems.reduce(
      (total, item) => total + client.hourly_rate * item.hours,
      0
    );
  };

  const totalAmount = calculateTotalAmount(invoice.workItems);

  const getBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning"; // Yellow badge for pending
      case "released":
        return "primary"; // Green badge for released
      case "received":
        return "success"; // Blue badge for received
      default:
        return "dark"; // Default dark badge for any other status
    }
  };

  return (
    <>
      <Row className="mt-3 mb-3">
        <Col>
          <Card className="shadow-sm">
            <Card.Header className=" text-white d-flex justify-content-between align-items-center">
              <strong>Invoice Details</strong>
              <Badge bg={getBadgeColor(invoice.status)}>
                {getStatusIcon(invoice.status)} {invoice.status.toUpperCase()}
              </Badge>
            </Card.Header>
            <Card.Body>
              <Card.Title className=" text-center mb-5">
                <h1>
                  <strong>
                    {invoice.invoiceNumber || `Invoice #${invoice.id}`}
                  </strong>
                </h1>
              </Card.Title>

              <Row className="mt-3 mb-3">
                {invoice.status === "released" && (
                  <>
                    <Col className="d-flex align-content-between  text-center">
                      <div className="mx-3">
                        <QRCodeComponent
                          value={`${process.env.NEXT_PUBLIC_API}/files/${invoice.invoiceNumber}.pdf`}
                        />
                        <h6>Invoice</h6>
                      </div>
                      <div className="mx-3">
                        <QRCodeComponent
                          value={`${process.env.NEXT_PUBLIC_API}/files/${invoice.invoiceNumber}.csv`}
                        />
                        <h6>Timesheet</h6>
                      </div>
                    </Col>
                  </>
                )}
                <Col>
                  <Card.Text className="d-flex align-items-center">
                    <FaInfoCircle className="me-2" />
                    <strong>Billed to:</strong>
                    <span className="ms-1">
                      {`${client.name} (${client.code})`}
                    </span>
                  </Card.Text>
                  <Card.Text className="d-flex align-items-center">
                    <FaDollarSign className="me-2 text-success" />
                    <strong>Converted amount:</strong>
                    <CurrencyConverterLabel
                      initialAmount={totalAmount}
                      initialCurrency={client.current_currency_code}
                      targetCurrency={client.convert_currency_code}
                    />
                  </Card.Text>
                  <Card.Text className="d-flex align-items-center">
                    <FaDollarSign className="me-2 text-success" />
                    <strong>Amount:</strong>
                    <span className="ms-1">{`${client.current_currency_code} ${totalAmount}`}</span>
                  </Card.Text>
                  <Card.Text className="d-flex align-items-center">
                    <FaCalendarAlt className="me-2 text-info" />
                    <strong>Date:</strong>
                    <span className="ms-1">
                      {new Date(invoice.date).toLocaleDateString()}
                    </span>
                  </Card.Text>
                </Col>
              </Row>
            </Card.Body>
            {invoice.status === "released" && (
              <Card.Footer>
                <ReceiveInvoiceButton invoiceId={invoiceId} />
              </Card.Footer>
            )}
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default InvoiceDetails;
