import { useState } from "react";
import ClientSelect from "../clients/ClientSelect";
import TimesheetTable from "./TimesheetTable";
import DateRangePicker from "@/shared/components/layout/DateRangePicker";
import { Col, Container, Row } from "react-bootstrap";

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

  return (
    <div className="mt-5">
      <Container>
        <Row>
          <Col>
            <ClientSelect onChange={(id) => setClientId(id)} />
          </Col>
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
      </Container>
      {clientId > 0 && range.startDate && range.endDate && (
        <TimesheetTable
          startDate={range.startDate}
          endDate={range.endDate}
          clientId={clientId}
        />
      )}
    </div>
  );
};

export default TimesheetContainer;
