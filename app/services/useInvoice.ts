import useAxiosClient from "./useAxiosClient";

const useInvoice = () => {
  const { client } = useAxiosClient();

  const fetchInvoices = (userId: number) => {
    return client.get<Models.Invoice[]>(`/invoice/list/${userId}`);
  };

  const fetchInvoiceById = (invoiceId: number) => {
    return client.get<Models.Invoice>(`/invoice/${invoiceId}`);
  };

  const writeInvoice = (invoiceData: Models.InvoiceData) => {
    return client.post<Models.Invoice>("/invoice/write", invoiceData);
  };

  const generateInvoice = (invoiceId: number) => {
    return client.post(`/invoice/${invoiceId}/generate`);
  };

  const releaseInvoice = (invoiceId: number, referenceNumber: number) => {
    return client.patch(`/invoice/${invoiceId}/release`, null, {
      params: {
        referrenceNumber: referenceNumber,
      },
    });
  };

  return {
    fetchInvoices,
    fetchInvoiceById,
    writeInvoice,
    generateInvoice,
    releaseInvoice,
  };
};

export default useInvoice;
