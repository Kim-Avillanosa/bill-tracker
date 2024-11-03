import useInvoice from "@/services/useInvoice";
import CurrencyConverterLabel from "@/shared/components/layout/CurrencyConverterLabel";
import React, { useCallback, useEffect, useState } from "react";
import { Card, Spinner, Alert, Row, Col, Badge } from "react-bootstrap";
import { FaDollarSign, FaCalendarAlt, FaInfoCircle } from "react-icons/fa";

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

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!invoice) {
    return <Alert variant="warning">No invoice selected.</Alert>;
  }
  const calculateTotalAmount = (workitems: Models.WorkItem[]): number => {
    return workitems.reduce(
      (total, item) => total + client.hourly_rate * item.hours,
      0
    );
  };

  const totalAmount = calculateTotalAmount(invoice.workItems);

  return (
    <Card className="mt-3 shadow-sm rounded border-0">
      <Card.Header className="bg-success text-white d-flex justify-content-between align-items-center">
        <strong>Invoice Details</strong>
        <Badge bg={"dark"}>{invoice.status.toUpperCase()}</Badge>
      </Card.Header>
      <Card.Body>
        <Card.Title className="text-secondary">
          <strong> {invoice.invoiceNumber || `Invoice #${invoice.id}`}</strong>
        </Card.Title>
        <Card.Subtitle className="mb-3 text-muted">
          <FaInfoCircle className="me-2" />
          {`Billed to: ${client.name} (${client.code})`}
        </Card.Subtitle>
        <Row className="mb-2">
          <Col>
            <Card.Text>
              <FaDollarSign className="me-2 text-success" />
              <strong>Converted amount:</strong>{" "}
              <CurrencyConverterLabel
                initialAmount={totalAmount}
                initialCurrency={"AUD"}
                targetCurrency={"PHP"}
              />
            </Card.Text>
            <Card.Text>
              <FaDollarSign className="me-2 text-success" />
              <strong>Amount:</strong> ${totalAmount}
            </Card.Text>
          </Col>
        </Row>
        <Row className="mb-2">
          <Col>
            <Card.Text>
              <FaCalendarAlt className="me-2 text-info" />
              <strong>Date:</strong>{" "}
              {new Date(invoice.date).toLocaleDateString()}
            </Card.Text>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default InvoiceDetails;
