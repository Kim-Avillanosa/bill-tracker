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

  const addTimesheet = (clientId: number, timesheetData: {
    tags: string[]; // Array of tags
    summary: string;
    entry_date: string;
  }) => {
    return client.post(`/client/${clientId}/timesheet/add`, {
      tags: JSON.stringify(timesheetData.tags), // Convert array to JSON string
      summary: timesheetData.summary,
      entry_date: timesheetData.entry_date,
    });
  };

  const listTimesheets = (clientId: number, startDate?: string, endDate?: string) => {
    const params: Record<string, string> = {};
    
    if (startDate) {
      params.startDate = startDate;
    }

    if (endDate) {
      params.endDate = endDate;
    }

    return client.get<Models.Timesheet[]>(`/client/${clientId}/timesheet/list`, {
      params,
    });
  };

  const updateTimesheet = (id: number, timesheetData: Partial<Omit<Models.Timesheet, 'id' | 'client' | 'created_at' | 'updated_at'>>) => {
    return client.patch(`/client/timesheet/${id}`, {
      ...timesheetData,
      tags: timesheetData.tags ? JSON.stringify(timesheetData.tags) : undefined, // Convert array to JSON string if provided
    });
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
