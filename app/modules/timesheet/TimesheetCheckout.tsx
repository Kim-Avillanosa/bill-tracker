import useModalStore from "@/shared/store/useModal";
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
  Card,
  Badge,
} from "react-bootstrap";
import TimesheetForm from "./TimesheetForm";
import useInvoice from "@/services/useInvoice";
import toast from "react-hot-toast";

interface Props {
  timesheets: Models.Timesheet[];
  client: Models.Client;
}

const TimesheetCheckout: React.FC<Props> = ({ timesheets, client }) => {
  const ratePerHour = parseFloat(client.hourly_rate);

  const { generateInvoice, writeInvoice } = useInvoice();
  const [hours, setHours] = useState<{ [key: number]: number }>(
    timesheets.reduce((acc, timesheet) => {
      acc[timesheet.id] = client.hours_per_day; // Default to client's daily hours
      return acc;
    }, {} as { [key: number]: number })
  );
  const { dismiss, openModal } = useModalStore();

  const [total, setTotal] = useState<number>(0);
  const [totalHours, setTotalHours] = useState<number>(0);

  const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>(
    timesheets.reduce((acc, timesheet) => {
      acc[timesheet.id] = true; // Set all items as checked by default
      return acc;
    }, {} as { [key: number]: boolean })
  );

  useEffect(() => {
    calculateTotals(hours, checkedItems);
  }, [hours, checkedItems]);

  const handleHoursChange = (id: number, newHours: number) => {
    const updatedHours = { ...hours, [id]: newHours };
    setHours(updatedHours);
  };

  const handleCheckboxChange = (id: number) => {
    const updatedCheckedItems = { ...checkedItems, [id]: !checkedItems[id] };
    setCheckedItems(updatedCheckedItems);
  };

  const calculateTotals = (
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
    setTotal(totalSum);

    const totalHoursWorked = timesheets.reduce((acc, timesheet) => {
      return (
        acc +
        (updatedCheckedItems[timesheet.id]
          ? updatedHours[timesheet.id] || 0
          : 0)
      );
    }, 0);
    setTotalHours(totalHoursWorked);
  };
  function removeCharacters(input: string): string {
    return input.replace(/[[\]"]/g, ""); // Removes [, ], and "
  }

  const handleGenerate = () => {
    const generatedData: Models.WorkItem[] = timesheets
      .filter((timesheet) => checkedItems[timesheet.id])
      .map((timesheet) => ({
        title: timesheet.summary, // Using the summary as the title
        description: removeCharacters(timesheet.tags),
        tags: timesheet.tags.split(",").map((tag) => tag.trim()), // Split tags into an array
        hours: hours[timesheet.id] || 0,
      }));

    toast.promise(
      writeInvoice({
        clientId: client.id,
        date: new Date().toDateString(),
        note: "This is an auto generated invoice for assistance please contact me at careers.kmavillanosa@gmail.com",
        workItems: generatedData,
      }).then((x) => {
        generateInvoice(x.data.id);

        return Promise.resolve(x);
      }),
      {
        loading: "Please wait we are generating your invoice",
        success: "Invoice has been generated",
        error: "Invoice generation failed",
      }
    );
    console.log(generatedData); // Replace this with your desired action
  };

  return (
    <Container>
      <Card className="mb-3">
        <Card.Body>
          <Card.Title as="h5">Rate Information</Card.Title>
          <Card.Text>
            <div className="d-flex ">
              <span>
                Rate per Hour:{" "}
                <strong>
                  {client.symbol} {client.hourly_rate}
                </strong>
              </span>
            </div>
          </Card.Text>
          <Card.Text>
            <div className="d-flex ">
              <span>Minimum working hours: </span>
              <Badge bg="success">{client.hours_per_day} hours</Badge>
            </div>
          </Card.Text>
          <Card.Text>
            <div className="d-flex">
              <span>Total Hours Worked:</span>
              <strong>{totalHours}</strong>
            </div>
          </Card.Text>
          <hr />
          <Card.Text>
            <div className="d-flex justify-content-between">
              <span>Total:</span>
              <h3>
                <strong>
                  {client.symbol}
                  {total.toFixed(2)}
                </strong>
              </h3>
            </div>
          </Card.Text>
        </Card.Body>
      </Card>
      <Table className="mt-5" striped bordered hover>
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
          {timesheets.map((timesheet) => (
            <tr key={timesheet.id}>
              <td>{new Date(timesheet.entry_date).toDateString()}</td>
              <td>{timesheet.summary}</td>
              <td>
                <Form.Control
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
              <td>
                <Form.Check
                  type="switch"
                  checked={checkedItems[timesheet.id] || false}
                  onChange={() => handleCheckboxChange(timesheet.id)}
                />
              </td>
              <td>
                <Button
                  variant="outline-dark"
                  onClick={() => {
                    openModal({
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
          ))}
        </tbody>
      </Table>
      <Row className="mt-3">
        <Col className="text-end">
          <Button
            variant="success"
            onClick={handleGenerate} // Use the handleGenerate function here
          >
            GENERATE
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default TimesheetCheckout;
