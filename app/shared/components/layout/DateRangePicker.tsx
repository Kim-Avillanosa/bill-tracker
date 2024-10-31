import React, { useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";

interface Props {
  onChange?: (startDate?: Date, endDate?: Date) => void; // Prop for the changed event
}

const DateRangePicker: React.FC<Props> = ({ onChange }) => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const handleStartDateChange = (date: Date | null) => {
    const newStartDate = date || undefined;
    setStartDate(newStartDate);
    if (onChange) {
      onChange(newStartDate, endDate); // Call onChange with the new start date
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    const newEndDate = date || undefined;
    setEndDate(newEndDate);
    if (onChange) {
      onChange(startDate, newEndDate); // Call onChange with the new end date
    }
  };

  return (
    <Form>
      <Form.Group controlId="dateRange">
        <Form.Label>Entry date</Form.Label> 
        <Row className="float-right">
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
