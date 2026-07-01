import { useState, useEffect, useCallback } from 'react';
import api from '../api';
import type { AxiosRequestConfig } from 'axios';

interface FetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<T | undefined>;
}

/**
 * Custom hook for GET/Query requests that execute automatically.
 */
export function useFetch<T = any>(url: string, config?: AxiosRequestConfig): FetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize config string to prevent unnecessary hook runs
  const configString = config ? JSON.stringify(config) : '';

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<T>(url, config);
      setData(response.data);
      setLoading(false);
      return response.data;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'An error occurred';
      setError(errMsg);
      setLoading(false);
      return undefined;
    }
  }, [url, configString]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
