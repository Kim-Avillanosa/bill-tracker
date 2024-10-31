import useTimesheets from "@/services/useTimesheets";
import React, { useEffect, useState } from "react";
import { Container, Table } from "react-bootstrap";

interface Props {
  clientId: number;
  startDate: string;
  endDate: string;
}
const TimesheetTable: React.FC<Props> = ({ clientId, startDate, endDate }) => {
  const { listTimesheets } = useTimesheets();
  const [timesheets, setTimesheets] = useState<Models.Timesheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTimesheets = async () => {
      setLoading(true);
      try {
        const response = await listTimesheets(clientId, startDate, endDate);
        setTimesheets(response.data); // Assuming the response has a 'data' property
      } catch {
        setError("Failed to load content");
      } finally {
        setLoading(false);
      }
    };

    fetchTimesheets();
  }, [clientId, startDate, endDate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading timesheets: {error}</div>;
  }

  return (
    <Container className="mt-5">
      <Table className="mt-3" bordered hover>
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">Summary</th>
            <th className="border border-gray-300 p-2">Entry Date</th>
            <th className="border border-gray-300 p-2">Tags</th>
            <th className="border border-gray-300 p-2">Client Name</th>
          </tr>
        </thead>
        <tbody>
          {timesheets.map((timesheet) => (
            <tr key={timesheet.id}>
              <td className="border border-gray-300 p-2">{timesheet.id}</td>
              <td className="border border-gray-300 p-2">
                {timesheet.summary}
              </td>
              <td className="border border-gray-300 p-2">
                {new Date(timesheet.entry_date).toLocaleString()}
              </td>
              <td className="border border-gray-300 p-2">
                {timesheet.tags && JSON.parse(timesheet.tags).join(", ")}
              </td>
              <td className="border border-gray-300 p-2">
                {timesheet.client.name}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default TimesheetTable;
