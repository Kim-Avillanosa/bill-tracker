import useInvoice from "@/services/useInvoice";
import useModalStore from "@/shared/store/useModal";
import { formatCurrency, roundCurrency, toNumber } from "@/lib/currency";
import CurrencyConverterLabel from "@/shared/components/layout/CurrencyConverterLabel";
import QRCodeComponent from "@/shared/components/layout/QRCodeContainer";
import React, { useCallback, useEffect, useState } from "react";
import {
  Card,
  Spinner,
  Alert,
  Row,
  Col,
  Badge,
  Container,
  Button,
  ButtonGroup,
} from "react-bootstrap";
import {
  FaDollarSign,
  FaCalendarAlt,
  FaInfoCircle,
  FaCheckCircle,
  FaClock,
  FaRegCheckCircle,
  FaHashtag,
} from "react-icons/fa";
import ReceiveInvoiceButton from "./ReceiveInvoiceButton";
import DeleteButton from "@/shared/components/layout/DeleteButton";
import InvoiceEditForm from "./InvoiceEditForm";
import toast from "react-hot-toast";
import { FaPencil } from "react-icons/fa6";

interface InvoiceDetailsProps {
  invoiceId: number;
  client: Models.Client;
  onDeleted?: () => void;
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({
  client,
  invoiceId,
  onDeleted,
}) => {
  const { fetchInvoiceById, deleteInvoice } = useInvoice();
  const { openModal } = useModalStore();
  const [invoice, setInvoice] = useState<Models.Invoice | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      await deleteInvoice(invoiceId);
      toast.success("Invoice deleted");
      onDeleted?.();
    } catch {
      toast.error("Failed to delete invoice");
    }
  };

  const handleEdit = () => {
    if (!invoice) return;
    openModal({
      size: "xl",
      title: `Edit invoice ${invoice.invoiceNumber}`,
      content: (
        <InvoiceEditForm
          invoice={invoice}
          client={client}
          onSuccess={() => {
            setLoading(true);
            fetchInvoiceById(invoiceId).then((res) => {
              setInvoice(res.data);
              setLoading(false);
            });
          }}
        />
      ),
    });
  };

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
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
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
    const fallbackRate = toNumber(client.hourly_rate);
    const total = workitems.reduce((sum, item) => {
      const itemRate = toNumber(item.rate) || fallbackRate;
      const itemHours = toNumber(item.hours);
      return sum + itemRate * itemHours;
    }, 0);
    return roundCurrency(total);
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
    <Row className="my-4">
      <Col>
        <Card className="shadow-sm">
          <Card.Header className=" text-white d-flex justify-content-between align-items-center flex-wrap gap-2">
            <strong>Invoice Details</strong>
            <div className="d-flex align-items-center gap-2">
              <ButtonGroup size="sm">
                <Button variant="outline-light" onClick={handleEdit}>
                  <FaPencil /> Edit
                </Button>
                <DeleteButton onDelete={handleDelete} />
              </ButtonGroup>
              <Badge bg={getBadgeColor(invoice.status)}>
                {getStatusIcon(invoice.status)} {invoice.status.toUpperCase()}
              </Badge>
            </div>
          </Card.Header>
          <Card.Body>
            <Card.Title className=" text-center mb-5">
              <h1>
                <strong>
                  {invoice.invoiceNumber || `Invoice #${invoice.id}`}
                </strong>
              </h1>
            </Card.Title>

            <Row>
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
                {invoice.status === "received" && (
                  <Card.Text>
                    <FaHashtag className="me-2 text-dark" />
                    <strong>Referrence Number:</strong>
                    <span className="ms-1 text-danger">
                      {invoice.referrenceNumber}
                    </span>
                  </Card.Text>
                )}
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
                  <span className="ms-1">
                    {formatCurrency(totalAmount, {
                      currencyCode: client.current_currency_code,
                    })}
                  </span>
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
  );
};

export default InvoiceDetails;
