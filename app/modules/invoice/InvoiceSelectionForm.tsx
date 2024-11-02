import React, { useState } from "react";
import InvoiceSelect from "./InvoiceSelect";
import { Button, Col, Container, Row } from "react-bootstrap";
import InvoiceDetails from "./InvoiceDetails";
import useInvoice from "@/services/useInvoice";
import toast from "react-hot-toast";
import useModalStore from "@/shared/store/useModal";
import InvoiceConfirmation from "./InvoiceConfirmation";

const InvoiceSelectionForm = () => {
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<
    number | undefined
  >(undefined);

  const { generateInvoice } = useInvoice();
  const [currentClient, setCurrentClient] = useState<
    Models.Client | undefined
  >();

  const { openModal, dismiss } = useModalStore();

  const handleInvoiceChange = (invoiceId: number) => {
    setSelectedInvoiceId(invoiceId);
    console.log("Selected Invoice ID:", invoiceId);
  };

  const openFileImmediately = (fileUrl: string) => {
    const newTab = window.open(fileUrl, "_blank");
    if (newTab) {
      newTab.focus(); // Focus the new tab
    } else {
      alert("Please allow popups for this site");
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <InvoiceSelect
            onReset={() => {
              setSelectedInvoiceId(undefined);
              setCurrentClient(undefined);
            }}
            selectedInvoiceId={selectedInvoiceId}
            onChange={(invoiceId, client) => {
              handleInvoiceChange(invoiceId);
              setCurrentClient(client);
            }}
          />
        </Col>
      </Row>
      <Row>
        {currentClient && selectedInvoiceId && (
          <Col>
            <InvoiceDetails
              invoiceId={selectedInvoiceId}
              client={currentClient}
            />
          </Col>
        )}
      </Row>

      {selectedInvoiceId && (
        <Button
          onClick={() => {
            toast.promise(
              generateInvoice(selectedInvoiceId).then((p) => {
                const result: string = p.data;

                dismiss();

                openFileImmediately(result);
                openModal({
                  size: "sm",
                  title: "Confirmation",
                  content: (
                    <InvoiceConfirmation
                      qrCodeSrc={result}
                      invoiceLink={result}
                    />
                  ),
                });
                return Promise.resolve(p);
              }),
              {
                loading: "Generating invoice, please wait",
                success: "Invoice has been generated",
                error: "Invoice generation failed, check logs",
              }
            );
          }}
          size="lg"
          variant="dark"
          className="mt-3 float-end"
        >
          Generate 💸💸💸
        </Button>
      )}
    </Container>
  );
};

export default InvoiceSelectionForm;
