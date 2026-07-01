import { useState, useEffect, useCallback } from 'react';
import api from '../api';
import type { AxiosRequestConfig } from 'axios';

interface FetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<T | undefined>;
}

interface MutationResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (variables?: any, config?: AxiosRequestConfig) => Promise<T>;
  reset: () => void;
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

/**
 * Custom hook for manual mutations (POST, PUT, PATCH, DELETE).
 */
export function useMutation<T = any>(
  url: string,
  method: 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'POST'
): MutationResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (variables?: any, config?: AxiosRequestConfig) => {
      setLoading(true);
      setError(null);
      const requestUrl = config?.url || url;
      try {
        let response;
        if (method === 'DELETE') {
          const deleteConfig = { ...config };
          if (variables !== undefined && variables !== null) {
            deleteConfig.data = variables;
          }
          response = await api.delete<T>(requestUrl, deleteConfig);
        } else if (method === 'POST') {
          response = await api.post<T>(requestUrl, variables, config);
        } else if (method === 'PUT') {
          response = await api.put<T>(requestUrl, variables, config);
        } else {
          response = await api.patch<T>(requestUrl, variables, config);
        }
        setData(response.data);
        setLoading(false);
        return response.data;
      } catch (err: any) {
        const errMsg = err.response?.data?.message || err.message || 'An error occurred';
        setError(errMsg);
        setLoading(false);
        throw new Error(errMsg);
      }
    },
    [url, method]
  );

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  return { data, loading, error, execute, reset };
}
