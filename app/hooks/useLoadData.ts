import {useEffect} from 'react';
import useSWR from 'swr';
import type {SWRConfiguration} from 'swr';

// Docs: https://swr.vercel.app/docs

const DEFAULT_OPTIONS: SWRConfiguration = {
  // false = Don't revalidate when window gets focused
  revalidateOnFocus: false,
  // true = Revalidate when the browser regains a network connection
  revalidateOnReconnect: true,
  // false = Don't retry when fetcher has an error
  shouldRetryOnError: false,
  // true = Return the previous key's data until the new data has been loaded
  keepPreviousData: true,
};

export function useLoadData<TData = unknown>(
  apiPath: string | null = null,
  options?: SWRConfiguration<TData>,
) {
  const {data, error, isLoading, isValidating, mutate} = useSWR<TData>(
    apiPath,
    async (url: string) => {
      try {
        const response = await fetch(url);

        if (!response.ok) {
          const error = new Error(
            `Request failed with status ${response.status}: ${response.statusText}`,
          );
          (error as Error & {status: number; statusText: string}).status =
            response.status;
          (error as Error & {status: number; statusText: string}).statusText =
            response.statusText;
          throw error;
        }

        return response.json();
      } catch (error) {
        console.error('useLoadData:error:', error);
        throw error;
      }
    },
    {
      ...DEFAULT_OPTIONS,
      ...options, // Add or override any additional options passed in
    },
  );

  useEffect(() => {
    if (error) {
      console.error('Error fetching data:', {
        message: error.message,
        status: (error as Error & {status?: number}).status,
        statusText: (error as Error & {statusText?: string}).statusText,
      });
    }
  }, [error]);

  return {data, error, isLoading, isValidating, mutate};
}
