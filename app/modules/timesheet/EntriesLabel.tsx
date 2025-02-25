import React from "react";
import { Card, ProgressBar } from "react-bootstrap";

type EntriesLabelProps = {
  days_per_week: number;
  total_entries: number;
  start_date: string;
  end_date: string;
};

const EntriesLabel: React.FC<EntriesLabelProps> = ({
  days_per_week,
  total_entries,
  start_date,
  end_date,
}) => {
  const getTotalDaysInRange = () => {
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    let totalDays = 0;

    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
      if (dayOfWeek > 0 && dayOfWeek < 6) totalDays++; // Weekdays only
    }

    return Math.min(
      totalDays,
      days_per_week *
        Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 7)
        )
    );
  };

  const totalDays = getTotalDaysInRange();
  const progress = (total_entries / totalDays) * 100;

  const tallyMet = progress >= totalDays;

  return (
    <Card className="text-cente float-start" style={{ width: "400px" }}>
      <Card.Body>
        <div className="d-flex align-items-center justify-content-between">
          <ProgressBar className="mx-3" style={{ width: "100%" }}>
            <ProgressBar
              variant={tallyMet ? "success" : "danger"}
              striped
              animated
              now={progress}
              label={`${progress.toFixed(2)}%`}
            />
          </ProgressBar>
          <span className="h6 mb-0">
            <strong>{`${total_entries}/${totalDays}`}</strong>
          </span>
        </div>
      </Card.Body>
    </Card>
  );
};

export default EntriesLabel;
