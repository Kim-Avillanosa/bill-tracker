import { useState } from "react";
import ClientSelect from "../clients/ClientSelect";
import TimesheetTable from "./TimesheetTable";
import DateRangePicker from "@/shared/components/layout/DateRangePicker";
import { Button, Col, Container, Row } from "react-bootstrap";
import useModalStore from "@/shared/store/useModal";
import TimesheetForm from "./TimesheetForm";
import useClient from "@/services/useClient";
import InvoiceHoursTableForm from "../invoice/InvoiceHoursTableForm";

interface DateRangeProps {
  startDate: string | null;
  endDate: string | null;
}

const TimesheetContainer: React.FC = () => {
  const [clientId, setClientId] = useState(0);
  const [range, setRange] = useState<DateRangeProps>({
    startDate: null,
    endDate: null,
  });

  const { openModal, dismiss } = useModalStore();
  const { getClient } = useClient();

  const handleCustomInvoice = async () => {
    if (!clientId) return;
    try {
      const response = await getClient(clientId);
      const client = response.data;
      if (!client) return;
      openModal({
        fullscreen: true,
        size: "xl",
        title: `Custom invoice – ${client.name}`,
        content: <InvoiceHoursTableForm client={client} />,
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="my-2 gap-4">
      <Container>
        <div className="toolbar-surface">
        <Row className="align-items-center g-2">
          <Col xs={12} md={5} xl={4}>
            <ClientSelect onChange={(id) => setClientId(id)} />
          </Col>
          <Col xs={12} md={7} xl={8}>
            <div
              className="d-flex flex-nowrap gap-2 align-items-stretch"
              style={{ minHeight: "38px" }}
            >
              <Button
                size="lg"
                variant="dark"
                className="flex-fill"
                style={{ minWidth: 0 }}
                hidden={!clientId}
                onClick={() => {
                  openModal({
                    size: "lg",
                    title: "New timesheet entry",
                    content: (
                      <TimesheetForm
                        clientId={clientId}
                        onSuccess={() => {
                          dismiss();
                        }}
                      />
                    ),
                  });
                }}
              >
                📅 New Timesheet entry
              </Button>
              <Button
                size="lg"
                variant="outline-dark"
                className="flex-fill"
                style={{ minWidth: 0 }}
                hidden={!clientId}
                onClick={handleCustomInvoice}
              >
                🎫 Custom invoice
              </Button>
            </div>
          </Col>
        </Row>
        <Row hidden={!clientId}>
          <Col>
            <DateRangePicker
              onChange={(start, end) =>
                setRange({
                  startDate: start?.toDateString() || "",
                  endDate: end?.toDateString() || "",
                })
              }
            />
          </Col>
        </Row>
        </div>
      </Container>

      {clientId > 0 && range.startDate && range.endDate && (
        <div className="mt-5">
          <TimesheetTable
            startDate={range.startDate}
            endDate={range.endDate}
            clientId={clientId}
          />
        </div>
      )}
    </div>
  );
};

export default TimesheetContainer;
