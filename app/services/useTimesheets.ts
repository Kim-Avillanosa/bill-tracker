import useAxiosClient from "./useAxiosClient";

interface Client {
  id: number;
  email: string;
  name: string;
  symbol: string;
  code: string;
  hourly_rate: string;
  hours_per_day: number;
  address: string;
  banner_color: string;
  headline_color: string;
  text_color: string;
  created_at: string;
  updated_at: string;
  userId: number;
  category: string;
}

const useTimesheets = () => {
  const { client } = useAxiosClient();

  const addTimesheet = (
    clientId: number,
    timesheetData: {
      tags: string[];
      summary: string;
      entry_date: string;
    }
  ) => {
    return client.post(`/client/${clientId}/timesheet/add`, {
      tags: timesheetData.tags, // Use the formatted string
      summary: timesheetData.summary,
      entry_date: timesheetData.entry_date,
    });
  };

  const updateTimesheet = (
    id: number,
    timesheetData: {
      tags: string[]; // Array of tags
      summary: string;
      entry_date: string;
    }
  ) => {
    return client.patch(`/client/timesheet/${id}`, {
      ...timesheetData,
      tags: timesheetData.tags, // Convert array to JSON string if provided
    });
  };

  const listTimesheets = (
    clientId: number,
    startDate?: string,
    endDate?: string
  ) => {
    const params: Record<string, string> = {};

    if (startDate) {
      params.startDate = startDate;
    }

    if (endDate) {
      params.endDate = endDate;
    }

    return client.get<Models.Timesheet[]>(
      `/client/${clientId}/timesheet/list`,
      {
        params,
      }
    );
  };

  const deleteTimesheet = (id: number) => {
    return client.delete(`/client/timesheet/${id}`);
  };

  return {
    addTimesheet,
    listTimesheets,
    updateTimesheet,
    deleteTimesheet,
  };
};

export default useTimesheets;
