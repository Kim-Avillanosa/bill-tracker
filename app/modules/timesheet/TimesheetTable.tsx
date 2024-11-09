import useTimesheets from "@/services/useTimesheets";
import DeleteButton from "@/shared/components/layout/DeleteButton";
import useModalStore from "@/shared/store/useModal";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Col,
  Container,
  Row,
  Table,
} from "react-bootstrap";
import TimesheetForm from "./TimesheetForm";
import { safeJsonParse } from "@/lib/safeJsonParse";
import TimesheetCheckout from "./TimesheetCheckout";
import useClient from "@/services/useClient";
import ClientForm from "../clients/ClientForm";
import { FaPencil } from "react-icons/fa6";
import { FaPencilAlt } from "react-icons/fa";

interface Props {
  clientId: number;
  startDate: string;
  endDate: string;
}

const TimesheetTable: React.FC<Props> = ({ clientId, startDate, endDate }) => {
  const { listTimesheets, deleteTimesheet } = useTimesheets();
  const { getClient } = useClient();

  const [timesheets, setTimesheets] = useState<Models.Timesheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isOpen, dismiss, openModal } = useModalStore();

  const [currentClient, setCurrentClient] = useState<
    Models.Client | undefined
  >();

  useEffect(() => {
    let isMounted = true;
    const fetchClient = async () => {
      try {
        const response = await getClient(clientId);
        if (isMounted && response) {
          setCurrentClient(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch client:", error);
      }
    };

    fetchClient();

    return () => {
      isMounted = false;
    };
  }, [clientId]);

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

  if (!currentClient) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="primary">Client not found</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="my-3">
        <Col xs={"auto"}>
          <div className="float-end">
            <Button
              hidden={!clientId}
              variant="outline-warning"
              className="text-dark"
              onClick={() => {
                openModal({
                  size: "lg",
                  title: `Preparing invoice for: ${currentClient.name}`,
                  content: (
                    <TimesheetCheckout
                      client={currentClient}
                      timesheets={timesheets}
                    />
                  ),
                });
              }}
            >
              ✍️ Write my invoice
            </Button>
          </div>
        </Col>
        <Col>
          <div className="float-end">
            <Button
              hidden={!clientId}
              variant="light"
              onClick={() => {
                openModal({
                  size: "lg",
                  title: `Update Client ${currentClient.name}`,
                  content: (
                    <ClientForm isUpdate={true} initialData={currentClient} />
                  ),
                });
              }}
            >
              <FaPencilAlt />{" "} Update client information
            </Button>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div
            style={{
              maxHeight: "1000px", // Set your desired height
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
                  <th className="border border-gray-300 ">ID</th>
                  <th className="border border-gray-300 ">Client Name</th>
                  <th className="border border-gray-300 ">Summary</th>
                  <th className="border border-gray-300 ">Entry Date</th>
                  <th className="border border-gray-300 ">Tags</th>
                  <th className="border border-gray-300 ">Actions</th>
                </tr>
              </thead>
              <tbody>
                {timesheets.map((timesheet) => {
                  const parsable = safeJsonParse<string[]>(timesheet.tags);
                  return (
                    <tr key={timesheet.id}>
                      <td className="border border-gray-300 ">
                        {timesheet.id}
                      </td>
                      <td className="border border-gray-300 ">
                        {timesheet.client.name}
                        <Badge className="ms-1">{timesheet.client.code}</Badge>
                      </td>
                      <td className="border border-gray-300 ">
                        {timesheet.summary}
                      </td>
                      <td className="border border-gray-300 ">
                        {new Date(timesheet.entry_date).toDateString()}
                      </td>
                      <td className="border border-gray-300 ">
                        {parsable?.map((tag, key) => (
                          <Badge bg="dark" pill key={key} className="m-1">
                            {tag}
                          </Badge>
                        ))}
                      </td>

                      <td className="border border-gray-300 ">
                        <Button
                          onClick={() => {
                            openModal({
                              size: "lg",
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
        </Col>
      </Row>
    </Container>
  );
};

export default TimesheetTable;
