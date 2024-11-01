import useAxiosClient from "./useAxiosClient";

const useInvoice = () => {
  const { client } = useAxiosClient();

  const writeInvoice = (invoiceData: Models.InvoiceData) => {
    return client.post<Models.Invoice>("/invoice/write", invoiceData);
  };

  const generateInvoice = (invoiceId: number) => {
    return client.post(`/invoice/${invoiceId}/generate`);
  };

  return { writeInvoice, generateInvoice };
};

export default useInvoice;
