import useInvoice from "@/services/useInvoice";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";

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
  const [invoices, setInvoices] = useState<Models.Invoice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchInvoices();
      setInvoices(response.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchInvoices, setLoading, setInvoices]);

  useEffect(() => {
    loadInvoices();
  }, []);

  return (
    <Form.Group controlId="invoiceSelect">
      <Form.Label>Select Invoice</Form.Label>
      <div className="d-flex align-items-center">
        <Form.Select
          value={selectedInvoiceId}
          onChange={(e) => {
            const invoiceId = Number(e.target.value);
            const currentInvoice = invoices.find(
              (invoice) => invoice.id === invoiceId
            );
            if (currentInvoice) {
              onChange(invoiceId, currentInvoice?.client);
            }
          }}
          disabled={loading}
        >
          <option value="">Select an invoice...</option>
          {invoices.map((invoice) => (
            <option key={invoice.id} value={invoice.id}>
              {`${invoice.status.toUpperCase()} | ${new Date(
                invoice.date
              ).toDateString()} |  ${invoice.client.name} - ${
                invoice.invoiceNumber
              }`}
            </option>
          ))}
        </Form.Select>
        <Button variant="dark" onClick={onReset} className="ms-2">
          Reset
        </Button>
      </div>
    </Form.Group>
  );
};

export default InvoiceSelect;
