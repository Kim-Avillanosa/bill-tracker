import { useState } from "react";
import ClientSelect from "../clients/ClientSelect";
import TimesheetTable from "./TimesheetTable";
import DateRangePicker from "@/shared/components/layout/DateRangePicker";
import { Button, Col, Container, Row } from "react-bootstrap";
import useModalStore from "@/shared/store/useModal";
import TimesheetForm from "./TimesheetForm";

interface DateRangeProps {
  startDate: string | null; // Changed to Date | null
  endDate: string | null; // Changed to Date | null
}

const TimesheetContainer: React.FC = () => {
  const [clientId, setClientId] = useState(0);
  const [range, setRange] = useState<DateRangeProps>({
    startDate: null,
    endDate: null,
  });

  const { openModal, dismiss } = useModalStore();

  return (
    <div className="my-2 gap-4">
      <Container>
        <div className="toolbar-surface">
        <Row>
          <Col xs={8} xl={6}>
            <ClientSelect onChange={(id) => setClientId(id)} />
          </Col>
          <Col xs={4} xl={6}>
            <Button
              size="lg"
              variant="dark"
              className="w-100"
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
