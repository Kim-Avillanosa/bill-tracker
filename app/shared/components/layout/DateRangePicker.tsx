import React, { useState, useEffect } from "react";
import { Form, Row, Col, Container, InputGroup } from "react-bootstrap";
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
    <Row className="mt-3">
      <Col xs={12} xl={6}>
        <InputGroup>
          <InputGroup.Text>Start date</InputGroup.Text>
          <DatePicker
            className=" form-control form-control-lg"
            selected={startDate}
            onChange={handleStartDateChange}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            dateFormat="yyyy/MM/dd"
            placeholderText="Start Date"
          />
        </InputGroup>
      </Col>
      <Col xs={12} xl={6}>
        <InputGroup>
          <InputGroup.Text>End date</InputGroup.Text>
          <DatePicker
            className="form-control  form-control-lg"
            selected={endDate}
            onChange={handleEndDateChange}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            dateFormat="yyyy/MM/dd"
            placeholderText="End Date"
          />
        </InputGroup>
      </Col>
    </Row>
  );
};

export default DateRangePicker;
