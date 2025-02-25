import useAxiosClient from "./useAxiosClient";

type ClientData = {
  name: string;
  code: string;
  symbol: string;
  address: string;
  hourly_rate: number;
  hours_per_day: number;
  days_per_week: number;
  category: string;
  banner_color: string;
  headline_color: string;
  text_color: string;
  current_currency_code: string;
  convert_currency_code: string;
};

const useClient = () => {
  const { client } = useAxiosClient();

  const addClient = (data: ClientData) => {
    return client.post("/client/add", data);
  };

  const getClientList = () => {
    return client.get<Models.Client[]>("/client/list");
  };

  const getClient = (id: number) => {
    return client.get<Models.Client>(`/client/${id}`);
  };

  const updateClient = (id: number, data: Partial<ClientData>) => {
    return client.patch(`/client/${id}`, data);
  };

  const deleteClient = (id: number) => {
    return client.delete(`/client/${id}`);
  };

  return {
    addClient,
    getClient,
    getClientList,
    updateClient,
    deleteClient,
  };
};

export default useClient;
