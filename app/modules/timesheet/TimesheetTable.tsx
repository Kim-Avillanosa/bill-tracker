import useTimesheets from "@/services/useTimesheets";
import DeleteButton from "@/shared/components/layout/DeleteButton";
import useModalStore from "@/shared/store/useModal";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Badge, Button, Container, Table } from "react-bootstrap";
import TimesheetForm from "./TimesheetForm";
import { safeJsonParse } from "@/lib/safeJsonParse";

interface Props {
  clientId: number;
  startDate: string;
  endDate: string;
}

const TimesheetTable: React.FC<Props> = ({ clientId, startDate, endDate }) => {
  const { listTimesheets, deleteTimesheet } = useTimesheets();
  const [timesheets, setTimesheets] = useState<Models.Timesheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { isOpen, dismiss, openModal } = useModalStore();

  const fetchTimesheets = useCallback(async () => {
    setLoading(true);
    try {
      const response = await listTimesheets(clientId, startDate, endDate);
      setTimesheets(response.data); // Assuming the response has a 'data' property
    } catch {
      setError("Failed to load content");
    } finally {
      setLoading(false);
    }
  }, [clientId, startDate, endDate]);

  useEffect(() => {
    fetchTimesheets();
  }, [fetchTimesheets]);

  useEffect(() => {
    if (!isOpen) {
      fetchTimesheets();
    }
  }, [isOpen, dismiss]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading timesheets: {error}</div>;
  }

  if (timesheets.length === 0) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="primary">There are no timesheet entries.</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <div
        style={{
          maxHeight: "400px", // Set your desired height
          overflowY: "auto", // Enable vertical scrolling
        }}
      >
        <Table striped bordered>
          <thead
            style={{
              position: "sticky",
              top: 0,
              padding: 0,
              backgroundColor: "#fff",
              zIndex: 0,
            }}
          >
            <tr>
              <th className="border border-gray-300 p-2">ID</th>
              <th className="border border-gray-300 p-2">Summary</th>
              <th className="border border-gray-300 p-2">Entry Date</th>
              <th className="border border-gray-300 p-2">Tags</th>
              <th className="border border-gray-300 p-2">Client Name</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {timesheets.map((timesheet) => {
              const parsable = safeJsonParse<string[]>(timesheet.tags);
              return (
                <tr key={timesheet.id}>
                  <td className="border border-gray-300 p-2">{timesheet.id}</td>
                  <td className="border border-gray-300 p-2">
                    {timesheet.summary}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {new Date(timesheet.entry_date).toDateString()}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {parsable?.map((tag, key) => (
                      <Badge bg="dark" pill key={key} className="m-1">
                        {tag}
                      </Badge>
                    ))}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {timesheet.client.name}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Button
                      onClick={() => {
                        openModal({
                          title: "Update timesheet",
                          content: (
                            <TimesheetForm
                              timesheet={timesheet}
                              clientId={clientId}
                              onSuccess={() => {
                                fetchTimesheets();
                                dismiss();
                              }}
                            />
                          ),
                        });
                      }}
                      size="sm"
                      variant="outline-dark"
                    >
                      Edit
                    </Button>
                    <DeleteButton
                      onDelete={() => {
                        if (timesheet.id) {
                          deleteTimesheet(timesheet.id).then(() => {
                            fetchTimesheets();
                          });
                        }
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default TimesheetTable;
