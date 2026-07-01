import { useState, useCallback } from 'react';
import api from '../api';
import type { AxiosRequestConfig } from 'axios';

interface MutationResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (variables?: any, config?: AxiosRequestConfig) => Promise<T>;
  reset: () => void;
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
          response = await api.post<T>(requestUrl, variables ?? {}, config);
        } else if (method === 'PUT') {
          response = await api.put<T>(requestUrl, variables ?? {}, config);
        } else {
          response = await api.patch<T>(requestUrl, variables ?? {}, config);
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
