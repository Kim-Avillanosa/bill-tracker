import useAuthStore from '@/shared/store/useAuthStore';
import useSWR from 'swr';
import useAxiosClient from './useAxiosClient';

export interface ChartData {
  monthlyIncome: Array<{
    month: string;
    currency: string;
    symbol: string;
    pending: number;
    released: number;
    received: number;
    total: number;
    hours: number;
  }>;
  clientIncome: Array<{
    client: string;
    currency: string;
    symbol: string;
    pending: number;
    released: number;
    received: number;
    total: number;
    hours: number;
  }>;
  statusSummary: Array<{
    currency: string;
    symbol: string;
    pending: number;
    released: number;
    received: number;
    total: number;
  }>;
  currencyBreakdown: Array<{
    currency: string;
    symbol: string;
    totalAmount: number;
    invoiceCount: number;
  }>;
  totalHours: number;
  recentInvoices: Array<{
    id: number;
    date: string;
    client: string;
    status: string;
    amount: number;
    currency: string;
    symbol: string;
    hours: number;
  }>;
  totalInvoices: number;
  filteredBy: { userId?: number; clientId?: number };
}

export const useChartData = (clientId?: number) => {
  const { currentAccount } = useAuthStore();
  const axiosClient = useAxiosClient();

  const fetcher = async (url: string) => {
    const response = await axiosClient.client.get(url);
    return response.data;
  };

  const key = currentAccount?.id 
    ? clientId 
      ? `/invoice/chart-summary/${currentAccount.id}?clientId=${clientId}`
      : `/invoice/chart-summary/${currentAccount.id}`
    : null;

  const { data, error, isLoading, mutate } = useSWR<ChartData>(
    key,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 30000, // Refresh every 30 seconds
    }
  );

  return {
    chartData: data,
    isLoading,
    error,
    mutate,
  };
}; 