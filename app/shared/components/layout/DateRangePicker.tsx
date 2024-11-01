import React, { useState, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";

interface Props {
  onChange?: (startDate?: Date, endDate?: Date) => void;
}

const DateRangePicker: React.FC<Props> = ({ onChange }) => {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const [startDate, setStartDate] = useState<Date | undefined>(firstDayOfMonth);
  const [endDate, setEndDate] = useState<Date | undefined>(lastDayOfMonth);

  useEffect(() => {
    if (onChange) {
      onChange(startDate, endDate); // Trigger onChange immediately on mount
    }
  }, []);

  const handleStartDateChange = (date: Date | null) => {
    const newStartDate = date || undefined;
    setStartDate(newStartDate);
    if (onChange) {
      onChange(newStartDate, endDate);
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    const newEndDate = date || undefined;
    setEndDate(newEndDate);
    if (onChange) {
      onChange(startDate, newEndDate);
    }
  };

  return (
    <Form>
      <Form.Group controlId="dateRange">
        <Row className="float-right">
          <Col className="align-content-center" xs={"auto"}>
            <Form.Label>
              <strong>Entry date: </strong>
            </Form.Label>
          </Col>
          <Col xs="auto">
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              dateFormat="yyyy/MM/dd"
              placeholderText="Start Date"
              className="form-control float-right"
            />
          </Col>
          <Col xs="auto">
            <DatePicker
              selected={endDate}
              onChange={handleEndDateChange}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              dateFormat="yyyy/MM/dd"
              placeholderText="End Date"
              className="form-control"
            />
          </Col>
        </Row>
      </Form.Group>
    </Form>
  );
};

export default DateRangePicker;
