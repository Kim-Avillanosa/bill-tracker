import useInvoice from "@/services/useInvoice";
import useModalStore from "@/shared/store/useModal";
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import toast from "react-hot-toast";
import InvoiceSelectionForm from "./InvoiceSelectionForm";

interface ReceiveInvoiceButtonProps {
  invoiceId: number;
}

const ReceiveInvoiceButton: React.FC<ReceiveInvoiceButtonProps> = ({
  invoiceId,
}) => {
  const { dismiss, openModal } = useModalStore();
  const { releaseInvoice } = useInvoice();
  const [showInput, setShowInput] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleReleaseClick = () => {
    setShowInput(!showInput);
  };

  const handleConfirmRelease = () => {
    if (referenceNumber) {
      setIsLoading(true);
      try {
        toast.promise(releaseInvoice(invoiceId, Number(referenceNumber)), {
          loading: "Processing request",
          success: "Invoice has been marked received",
          error: "Request cannot be processed",
        });

        dismiss();

        // Optionally handle success (e.g., show a success message)
      } catch (error) {
        // Optionally handle error (e.g., show an error message)
      } finally {
        openModal({
          size: "lg",
          title: "Generate Invoice & Timesheet",
          content: <InvoiceSelectionForm />,
        });
        setIsLoading(false);
        setShowInput(false);
        setReferenceNumber(""); // Reset reference number
      }
    }
  };

  return (
    <div className="float-end d-flex">
      {showInput && (
        <div>
          <Form.Group controlId="referenceNumber" className="mx-2">
            <Form.Control
              type="text"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="Enter referrence number"
            />
          </Form.Group>
        </div>
      )}

      {showInput && (
        <Button
          size="sm"
          variant="success"
          onClick={handleConfirmRelease}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Confirm"}
        </Button>
      )}
      <Button
        size="sm"
        className="ms-1"
        variant={showInput ? "light" : "outline-dark"}
        onClick={handleReleaseClick}
      >
        {showInput ? "Cancel" : "Mark as received"}
      </Button>
    </div>
  );
};

export default ReceiveInvoiceButton;
