import useInvoice from "@/services/useInvoice";
import useModalStore from "@/shared/store/useModal";
import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Table,
  Card,
  Container,
  Col,
  Row,
} from "react-bootstrap";
import toast from "react-hot-toast";

interface InvoiceItem {
  id: number;
  title: string;
  description: string;
  entryDate: string;
  amount: number | "";
  hours: number;
}

interface InvoiceItemsFormProps {
  /** Your hourly rate (e.g., 23.75) */
  client: Models.Client;
  onItemsChange?: (items: InvoiceItem[]) => void;
}

const InvoiceItemsForm: React.FC<InvoiceItemsFormProps> = ({
  client,
  onItemsChange,
}) => {
  const { hourly_rate: hourlyRate } = client;
  const { dismiss } = useModalStore();

  const { writeInvoice } = useInvoice();
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: Date.now(),
      title: "",
      description: "",
      entryDate: new Date().toISOString().split("T")[0],
      amount: "",
      hours: 0,
    },
  ]);

  const generatedData: Models.WorkItem[] = items.map((timesheet) => ({
    entry_date: timesheet.entryDate,
    title: timesheet.title,
    description: timesheet.description,
    tags: [timesheet.description],
    hours: timesheet.hours,
  }));

  const write = () => {
    toast.promise(
      writeInvoice({
        clientId: client.id,
        date: new Date().toDateString(),
        note: "",
        workItems: generatedData,
      }),
      {
        loading: "Please wait we are generating your invoice",
        success: "Invoice has been generated",
        error: "Invoice generation failed",
      }
    );
    dismiss();
  };

  useEffect(() => {
    onItemsChange?.(items);
  }, [items, onItemsChange]);

  const updateItem = (
    id: number,
    field: keyof InvoiceItem,
    value: string | number | ""
  ) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value } as InvoiceItem;
        if (field === "amount") {
          const amt =
            typeof updated.amount === "number"
              ? updated.amount
              : parseFloat(updated.amount) || 0;
          updated.hours = hourlyRate > 0 ? amt / hourlyRate : 0;
        }
        return updated;
      })
    );
  };

  const addItem = () =>
    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: "",
        description: "",
        entryDate: new Date().toISOString().split("T")[0],
        amount: "",
        hours: 0,
      },
    ]);

  const removeItem = (id: number) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  // Compute totals
  const totalAmount = items.reduce(
    (sum, item) => sum + (typeof item.amount === "number" ? item.amount : 0),
    0
  );
  const totalHours = items.reduce((sum, item) => sum + item.hours, 0);

  return (
    <>
      <Container>
        <Row>
          <Col>
            <Card className="p-3">
              <Card.Body>
                <Card.Title>
                  <strong>Total Amount:</strong>{" "}
                  {`${totalAmount.toFixed(2)} ${client.current_currency_code}`}
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="p-3">
              <Card.Body>
                <Card.Title>
                  <strong>Total Hours:</strong> {totalHours.toFixed(2)}
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button variant="light" className="m-3 float-end" onClick={addItem}>
              ➕ Add Item
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table responsive striped bordered>
              <colgroup>
                <col style={{ width: "20%" }} />
                <col style={{ width: "25%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "20%" }} />
                <col style={{ width: "15%" }} />
                <col />
              </colgroup>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Entry Date</th>
                  <th>Amount</th>
                  <th>Equivalent Hours</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <Form.Control
                        type="text"
                        value={item.title}
                        onChange={(e) =>
                          updateItem(item.id, "title", e.target.value)
                        }
                        placeholder="Title"
                      />
                    </td>
                    <td>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        value={item.description}
                        onChange={(e) =>
                          updateItem(item.id, "description", e.target.value)
                        }
                        placeholder="Description"
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="date"
                        value={item.entryDate}
                        onChange={(e) =>
                          updateItem(item.id, "entryDate", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        value={item.amount}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "amount",
                            e.target.value === ""
                              ? ""
                              : parseFloat(e.target.value)
                          )
                        }
                        placeholder="Amount"
                        min={0}
                      />
                    </td>
                    <td>{item.hours.toFixed(2)}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button variant="success" className="m-3 float-end" onClick={write}>
              I CONFIRM THAT THIS INVOICE IS COMPLETE
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default InvoiceItemsForm;
