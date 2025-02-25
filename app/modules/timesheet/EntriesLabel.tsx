import React from "react";
import { Card, ProgressBar } from "react-bootstrap";

type EntriesLabelProps = {
  days_per_week: number;
  total_entries: number;
};

const EntriesLabel: React.FC<EntriesLabelProps> = ({
  days_per_week,
  total_entries,
}) => {
  const getTotalDaysInMonth = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Calculate total working days based on days_per_week
    let totalDays = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
      if (dayOfWeek > 0 && dayOfWeek < 6) totalDays++; // Weekdays only
    }
    return Math.min(totalDays, days_per_week * 4); // Approximate to 4 weeks per month
  };

  const totalDays = getTotalDaysInMonth();
  const progress = (total_entries / totalDays) * 100;

  return (
    <Card className="text-center p-4">
      <Card.Body>
        <Card.Title className="display-4">{`${total_entries}/${totalDays}`}</Card.Title>
        <ProgressBar now={progress} label={`${progress.toFixed(2)}%`} />
      </Card.Body>
    </Card>
  );
};

export default EntriesLabel;
