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
import EntriesLabel from "./EntriesLabel";
import InvoiceHoursTableForm from "../invoice/InvoiceHoursTableForm";

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
      {/* <Row>
        <Col>
          <InvoiceChecker startDate={startDate} endDate={endDate} />
        </Col>
      </Row> */}
      <Row className="my-3">
        <Col>
          <div className="toolbar-surface">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <EntriesLabel
              start_date={startDate}
              end_date={endDate}
              total_entries={timesheets.length}
              days_per_week={currentClient.days_per_week}
            />
          <div className="float-end">
            <Button
              size="lg"
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
              Update client information
            </Button>
            <Button
              hidden={!clientId}
              variant="outline-warning"
              size="lg"
              className="text-dark ms-3"
              onClick={() => {
                openModal({
                  fullscreen: true,
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
            <Button
              size="lg"
              hidden={!clientId}
              variant="outline-success"
              className="text-dark ms-3"
              onClick={() => {
                openModal({
                  fullscreen: true,
                  size: "xl",
                  title: `Custom invoice ${currentClient.name}`,
                  content: <InvoiceHoursTableForm client={currentClient} />,
                });
              }}
            >
              🎫 Custom invoice
            </Button>
          </div>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <div
            className="table-surface"
            style={{
              maxHeight: "1000px", // Set your desired height
              overflowY: "auto", // Enable vertical scrolling
            }}
          >
            <Table responsive striped bordered>
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
                  <th className="border border-gray-300">Client Name</th>
                  <th className="border border-gray-300">Summary</th>
                  <th className="border border-gray-300">Entry Date</th>
                  <th className="border border-gray-300">Tags</th>
                  <th className="border border-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {timesheets.map((timesheet) => {
                  const parsable = safeJsonParse<string[]>(timesheet.tags);
                  return (
                    <tr key={timesheet.id}>
                      <td className="border border-gray-300 w-25">
                        {timesheet.client.name}
                        <Badge pill className="ms-1" bg="primary">
                          {timesheet.client.code}
                        </Badge>
                      </td>
                      <td className="border border-gray-300">
                        {timesheet.summary}
                      </td>
                      <td className="border border-gray-300">
                        {new Date(timesheet.entry_date).toDateString()}
                      </td>
                      <td className="border border-gray-300">
                        {parsable?.map((tag, key) => (
                          <Badge bg="dark" pill key={key} className="m-1">
                            {tag}
                          </Badge>
                        ))}
                      </td>
                      <td className="border border-gray-300 align-content-center">
                        <div className="d-flex gap-1  float-end">
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
                            variant="outline-dark"
                          >
                            <FaPencilAlt />
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
                        </div>
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
