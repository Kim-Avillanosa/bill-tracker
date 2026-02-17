import useAuthStore from "@/shared/store/useAuthStore";
import axios from "axios";
import { useCallback, useMemo } from "react";

const useAxiosClient = () => {
  const { token } = useAuthStore();

  const client = useMemo(() => {
    const instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API,
    });

    // Request interceptor
    instance.interceptors.request.use(
      (config) => {
        config.headers["Authorization"] = `Bearer ${token}`;
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    instance.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(error)
    );

    return instance;
  }, [token]);

  const fetcher = useCallback(
    (url: string) => client.get(url).then((res) => res.data),
    [client]
  );

  return { client, fetcher };
};

export default useAxiosClient;
