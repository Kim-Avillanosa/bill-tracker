import useAxiosClient from "./useAxiosClient";

type ClientData = {
  name: string;
  code: string;
  symbol: string;
  address: string;
  hourly_rate: number;
  hours_per_day: number;
  category: string;
  banner_color: string;
  headline_color: string;
  text_color: string;
};

const useClient = () => {
  const { client } = useAxiosClient();

  const addClient = (data: ClientData) => {
    return client.post("/client/add", data);
  };

  const getClientList = () => {
    return client.get("/client/list");
  };

  const updateClient = (id: string, data: Partial<ClientData>) => {
    return client.patch(`/client/${id}`, data);
  };

  const deleteClient = (id: string) => {
    return client.delete(`/client/${id}`);
  };

  return {
    addClient,
    getClientList,
    updateClient,
    deleteClient,
  };
};

export default useClient;
