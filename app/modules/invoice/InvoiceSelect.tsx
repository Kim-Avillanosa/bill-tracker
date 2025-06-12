import useInvoice from "@/services/useInvoice";
import useAuthStore from "@/shared/store/useAuthStore";
import React, { useCallback, useEffect, useState } from "react";
import { Badge, Button, Form } from "react-bootstrap";

interface InvoiceSelectProps {
  onChange: (selectedInvoiceId: number, selectedClient: Models.Client) => void;
  onReset: () => void;
  selectedInvoiceId?: number;
}

const InvoiceSelect: React.FC<InvoiceSelectProps> = ({
  onChange,
  onReset,
  selectedInvoiceId,
}) => {
  const { fetchInvoices } = useInvoice();
  const { currentAccount } = useAuthStore();
  const [invoices, setInvoices] = useState<Models.Invoice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadInvoices = useCallback(async () => {
    setLoading(true);
    try {
      if (currentAccount?.id) {
        const response = await fetchInvoices(currentAccount?.id);
        setInvoices(response.data);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchInvoices, currentAccount]);

  useEffect(() => {
    loadInvoices();
  }, []);

  // Function to determine badge color based on status
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "overdue":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <Form.Group controlId="invoiceSelect">
      <div className="flex d-flex">
        <Form.Select
          size="lg"
          defaultValue={selectedInvoiceId}
          onChange={(e) => {
            const invoiceId = Number(e.target.value);
            const currentInvoice = invoices.find(
              (invoice) => invoice.id === invoiceId
            );
            if (currentInvoice) {
              onChange(invoiceId, currentInvoice.client);
            }
          }}
        >
          <option value={undefined}>Select an invoice...</option>
          {invoices.map((invoice) => (
            <option key={invoice.id} value={invoice.id}>
              <Badge bg={getStatusVariant(invoice.status)}>
                {invoice.status.toUpperCase()}
              </Badge>{" "}
              | {new Date(invoice.date).toDateString()} | {invoice.client.name}{" "}
              - {invoice.invoiceNumber}
            </option>
          ))}
        </Form.Select>
        <Button
          size="sm"
          variant="dark"
          onClick={() => {
            loadInvoices();
            onReset();
          }}
          className="ms-2"
        >
          ↻ Reset
        </Button>
      </div>
    </Form.Group>
  );
};

export default InvoiceSelect;
