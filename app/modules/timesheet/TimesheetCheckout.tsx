import useModalStore from "@/shared/store/useModal";
import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
  Card,
  Badge,
  Accordion,
} from "react-bootstrap";
import TimesheetForm from "./TimesheetForm";
import useInvoice from "@/services/useInvoice";
import toast from "react-hot-toast";
import CurrencyConverterLabel from "@/shared/components/layout/CurrencyConverterLabel";
import { safeJsonParse } from "@/lib/safeJsonParse";
import { FaCheck } from "react-icons/fa";
import { formatCurrency, roundCurrency, roundTo, toNumber } from "@/lib/currency";

interface Props {
  timesheets: Models.Timesheet[];
  client: Models.Client;
}

interface InvoiceItem {
  id: number;
  title: string;
  description: string;
  entryDate: string;
  amount: number | "";
  hours: number;
}

const TimesheetCheckout: React.FC<Props> = ({ timesheets, client }) => {
  const ratePerHour = toNumber(client.hourly_rate);

  const { writeInvoice } = useInvoice();
  const [hours, setHours] = useState<{ [key: number]: number }>(
    timesheets.reduce((acc, timesheet) => {
      acc[timesheet.id] = client.hours_per_day; // Default to client's daily hours
      return acc;
    }, {} as { [key: number]: number })
  );
  const { dismiss, openModal } = useModalStore();

  const [total, setTotal] = useState<number>(0);
  const [totalHours, setTotalHours] = useState<number>(0);
  const [extraItems, setExtraItems] = useState<InvoiceItem[]>([]);

  // Compute totals
  const extraTotalAmount = extraItems.reduce(
    (sum, item) => sum + (typeof item.amount === "number" ? item.amount : 0),
    0
  );
  const extraTotalHours = extraItems.reduce((sum, item) => sum + item.hours, 0);

  const overallHours = totalHours + extraTotalHours;
  const overallAmount = roundCurrency(total + extraTotalAmount);

  const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>(
    timesheets.reduce((acc, timesheet) => {
      acc[timesheet.id] = true; // Set all items as checked by default
      return acc;
    }, {} as { [key: number]: boolean })
  );

  const calculateTotals = useCallback(
    (
      updatedHours: { [key: number]: number },
      updatedCheckedItems: { [key: number]: boolean }
    ) => {
      const totalSum = timesheets.reduce((acc, timesheet) => {
        return (
          acc +
          (updatedCheckedItems[timesheet.id]
            ? (updatedHours[timesheet.id] || 0) * ratePerHour
            : 0)
        );
      }, 0);
      setTotal(roundCurrency(totalSum));

      const totalHoursWorked = timesheets.reduce((acc, timesheet) => {
        return (
          acc +
          (updatedCheckedItems[timesheet.id]
            ? updatedHours[timesheet.id] || 0
            : 0)
        );
      }, 0);
      setTotalHours(totalHoursWorked);
    },
    [timesheets, setTotalHours, ratePerHour]
  );

  useEffect(() => {
    calculateTotals(hours, checkedItems);
  }, [hours, checkedItems, calculateTotals]);

  const handleHoursChange = (id: number, newHours: number) => {
    const updatedHours = { ...hours, [id]: newHours };
    setHours(updatedHours);
  };

  const handleCheckboxChange = (id: number) => {
    const updatedCheckedItems = { ...checkedItems, [id]: !checkedItems[id] };
    setCheckedItems(updatedCheckedItems);
  };

  function removeCharacters(input: string): string {
    return input.replace(/[[\]"]/g, ""); // Removes [, ], and "
  }

  const handleGenerate = () => {
    const generatedData: Models.WorkItem[] = timesheets
      .filter((timesheet) => checkedItems[timesheet.id])
      .map((timesheet) => ({
        entry_date: timesheet.entry_date,
        title: timesheet.summary, // Using the summary as the title
        description: removeCharacters(timesheet.tags),
        tags: timesheet.tags.split(",").map((tag) => tag.trim()), // Split tags into an array
        hours: hours[timesheet.id] || 0,
      }));

    const extraGeneratedData: Models.WorkItem[] = extraItems.map(
      (timesheet) => ({
        entry_date: timesheet.entryDate,
        title: timesheet.title,
        description: timesheet.description,
        tags: [timesheet.description],
        hours: timesheet.hours,
      })
    );

    toast.promise(
      writeInvoice({
        clientId: client.id,
        date: new Date().toDateString(),
        note: "",
        workItems: generatedData.concat(extraGeneratedData),
      }),
      {
        loading: "Please wait we are generating your invoice",
        success: "Invoice has been generated",
        error: "Invoice generation failed",
      }
    );
    dismiss();
  };

  const updateItem = (
    id: number,
    field: keyof InvoiceItem,
    value: string | number | ""
  ) => {
    setExtraItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value } as InvoiceItem;
        if (field === "amount") {
          const amt =
            typeof updated.amount === "number"
              ? updated.amount
              : parseFloat(updated.amount) || 0;
          updated.hours = ratePerHour > 0 ? roundTo(amt / ratePerHour, 4) : 0;
        }
        return updated;
      })
    );
  };

  const addItem = () =>
    setExtraItems((prev) => [
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
    setExtraItems((prev) => prev.filter((i) => i.id !== id));

  return (
    <Container className="mb-5">
      <Card className="mb-3" bg="light">
        <Card.Body>
          <Card.Title as="h1">
            <strong>Rate Information</strong>
          </Card.Title>
          <Card.Text>
            <div className="d-flex ">
              <span>
                Rate per Hour:{" "}
                <strong>
                  {formatCurrency(ratePerHour, {
                    currencyCode: client.current_currency_code,
                  })}
                </strong>
              </span>
            </div>
          </Card.Text>
          <Card.Text>
            <div className="d-flex ">
              <span>Minimum working hours: </span>
              <Badge className="ms-1" bg="success">
                {client.hours_per_day} hours
              </Badge>
            </div>
          </Card.Text>
          <Card.Text>
            <div className="d-flex">
              <span>Total Hours Worked:</span>
              <strong className="ms-1">{overallHours.toFixed(2)}</strong>
            </div>
          </Card.Text>
          <hr />
          <Card.Text>
            <span>Total:</span>

            <div className="d-flex justify-content-end">
              <h4>
                <strong>
                  {formatCurrency(overallAmount, {
                    currencyCode: client.current_currency_code,
                  })}
                </strong>
                <strong>
                  <CurrencyConverterLabel
                    initialAmount={overallAmount}
                    initialCurrency={client.current_currency_code}
                    targetCurrency={client.convert_currency_code}
                  />
                </strong>
              </h4>
            </div>
          </Card.Text>
        </Card.Body>
      </Card>
      <Table className="my-5" bordered hover>
        <thead>
          <tr>
            <th>Date</th>
            <th>Summary</th>
            <th>Hours</th>
            <th>Include</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {timesheets.map((timesheet) => {
            const parsable = safeJsonParse<string[]>(timesheet.tags);
            return (
              <tr key={timesheet.id}>
                <td>{new Date(timesheet.entry_date).toDateString()}</td>
                <td className="w-50">
                  <div className="mb-1">{timesheet.summary}</div>
                  <div>
                    {parsable?.map((tag, key) => (
                      <small>
                        <Badge bg="dark" pill>
                          {tag}
                        </Badge>
                      </small>
                    ))}
                  </div>
                </td>
                <td className=" align-content-center w-25">
                  <Form.Control
                    size="lg"
                    type="number"
                    placeholder="Hours"
                    value={hours[timesheet.id] || ""}
                    onChange={(e) =>
                      handleHoursChange(
                        timesheet.id,
                        parseFloat(e.target.value) || 0
                      )
                    }
                    disabled={!checkedItems[timesheet.id]}
                  />
                </td>
                <td className="align-content-center">
                  <Form.Check
                    type="switch"
                    checked={checkedItems[timesheet.id] || false}
                    onChange={() => handleCheckboxChange(timesheet.id)}
                  />
                </td>
                <td className="align-content-center">
                  <Button
                    variant="outline-dark"
                    onClick={() => {
                      openModal({
                        size: "lg",
                        title: "Update timesheet",
                        content: (
                          <TimesheetForm
                            timesheet={timesheet}
                            clientId={client.id}
                            onSuccess={() => {
                              dismiss();
                            }}
                          />
                        ),
                      });
                    }}
                  >
                    Edit
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <Row>
        <Col>
          <Accordion flush className="mb-5">
            <Accordion.Header>Additional fees</Accordion.Header>
            <Accordion.Body>
              <Container>
                <Row>
                  <Col>
                    <Button
                      variant="dark"
                      className="float-end"
                      onClick={addItem}
                    >
                      ➕ Add entry
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
                        {extraItems.map((item) => (
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
                                  updateItem(
                                    item.id,
                                    "description",
                                    e.target.value
                                  )
                                }
                                placeholder="Description"
                              />
                            </td>
                            <td>
                              <Form.Control
                                type="date"
                                value={item.entryDate}
                                onChange={(e) =>
                                  updateItem(
                                    item.id,
                                    "entryDate",
                                    e.target.value
                                  )
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
                            <td>{roundTo(item.hours, 2).toFixed(2)}</td>
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
              </Container>
            </Accordion.Body>
          </Accordion>
        </Col>
      </Row>

      <Row className="my-3">
        <Col className="text-end">
          <Button
            size="lg"
            variant="success"
            onClick={handleGenerate} // Use the handleGenerate function here
          >
            I CONFIRM THAT THIS INVOICE IS COMPLETE
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default TimesheetCheckout;
