import React, { useState, useEffect } from "react";
import {
  lastDayOfMonth,
  isAfter,
  isBefore,
  parseISO,
  subBusinessDays,
  isWeekend,
} from "date-fns";
import { Alert } from "react-bootstrap";

type InvoiceCheckerProps = {
  startDate: string;
  endDate: string;
};

const InvoiceChecker: React.FC<InvoiceCheckerProps> = ({
  startDate,
  endDate,
}) => {
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    const today = new Date();
    const start = parseISO(startDate);
    const end = parseISO(endDate);

    // Determine the last business day of the month
    let lastBusinessDay = lastDayOfMonth(today);
    while (isWeekend(lastBusinessDay)) {
      lastBusinessDay.setDate(lastBusinessDay.getDate() - 1);
    }

    // Calculate the earliest send date (ideal submission start)
    let earliestSendDate = subBusinessDays(lastBusinessDay, 6);

    if (isBefore(today, earliestSendDate)) {
      setStatus("❌ Too early to send the invoice.");
    } else if (isAfter(today, end)) {
      setStatus(
        "✅ Invoice submission period has lapsed, but you can still send it manually."
      );
    } else if (isBefore(today, lastBusinessDay)) {
      setStatus("✅ You're in the ideal period to send your invoice!");
    } else {
      setStatus("✅ Today is the last day to send your invoice!");
    }
  }, [startDate, endDate]);

  return (
    <Alert
      className="p-1"
      variant={status.includes("✅") ? "success" : "danger"}
    >
      {status}
    </Alert>
  );
};

export default InvoiceChecker;
