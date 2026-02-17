import useAxiosClient from "./useAxiosClient";
import { useCallback, useMemo } from "react";

const useInvoice = () => {
  const { client } = useAxiosClient();

  const fetchInvoices = useCallback((userId: number) => {
    return client.get<Models.Invoice[]>(`/invoice/list/${userId}`);
  }, [client]);

  const fetchInvoiceById = useCallback((invoiceId: number) => {
    return client.get<Models.Invoice>(`/invoice/${invoiceId}`);
  }, [client]);

  const writeInvoice = useCallback((invoiceData: Models.InvoiceData) => {
    return client.post<Models.Invoice>("/invoice/write", invoiceData);
  }, [client]);

  const generateInvoice = useCallback((invoiceId: number) => {
    return client.post(`/invoice/${invoiceId}/generate`);
  }, [client]);

  const releaseInvoice = useCallback((invoiceId: number, referenceNumber: number) => {
    return client.patch(`/invoice/${invoiceId}/release`, null, {
      params: {
        referrenceNumber: referenceNumber,
      },
    });
  }, [client]);

  const updateInvoice = useCallback((
    invoiceId: number,
    data: Partial<Models.InvoiceData>
  ) => {
    return client.patch<Models.Invoice>(`/invoice/${invoiceId}`, data);
  }, [client]);

  const deleteInvoice = useCallback((invoiceId: number) => {
    return client.delete(`/invoice/${invoiceId}`);
  }, [client]);

  return useMemo(
    () => ({
      fetchInvoices,
      fetchInvoiceById,
      writeInvoice,
      generateInvoice,
      releaseInvoice,
      updateInvoice,
      deleteInvoice,
    }),
    [
      fetchInvoices,
      fetchInvoiceById,
      writeInvoice,
      generateInvoice,
      releaseInvoice,
      updateInvoice,
      deleteInvoice,
    ]
  );
};

export default useInvoice;
