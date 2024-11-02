import React, { useState } from "react";
import InvoiceSelect from "./InvoiceSelect";
import { Button, Col, Container, Row } from "react-bootstrap";
import InvoiceDetails from "./InvoiceDetails";
import useInvoice from "@/services/useInvoice";
import toast from "react-hot-toast";
import useModalStore from "@/shared/store/useModal";
import QRCodeComponent from "@/shared/components/layout/QRCodeContainer";

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
                dismiss();

                openModal({
                  size: "xl",
                  title: "Invoice has been generated!",
                  content: (
                    <QRCodeComponent
                      title={currentClient?.name || ""}
                      value="Google.com"
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
