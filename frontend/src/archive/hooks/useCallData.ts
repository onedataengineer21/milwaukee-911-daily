import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { useCallStore } from '../store/callStore';
import { useEffect } from 'react';

/**
 * React Query hook for fetching and auto-refreshing Milwaukee 911 call data
 * Refetches every 5 minutes to match backend scraping interval
 */
export function useCallData() {
  const { setCallData, setLoading, setError, setLastUpdate } = useCallStore();

  const query = useQuery({
    queryKey: ['milwaukeeCalls'],
    queryFn: api.fetchCalls,
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    refetchIntervalInBackground: true,
    staleTime: 4 * 60 * 1000, // Consider stale after 4 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Sync query state with Zustand store
  useEffect(() => {
    if (query.data) {
      setCallData(query.data);
      setLastUpdate(new Date());
    }
    setLoading(query.isLoading);
    if (query.error) {
      setError(query.error instanceof Error ? query.error.message : 'Failed to fetch data');
    }
  }, [query.data, query.isLoading, query.error, setCallData, setLoading, setError, setLastUpdate]);

  return {
    ...query,
    callData: query.data,
  };
}
