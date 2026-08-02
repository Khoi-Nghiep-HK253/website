import { QueryClient } from '@tanstack/react-query';

/**
 * Global QueryClient instance with production-ready default options
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 5 minutes
      staleTime: 1000 * 60 * 5,
      // Inactive query cache is garbage collected after 15 minutes
      gcTime: 1000 * 60 * 15,
      // Retry failed queries once before throwing error
      retry: 1,
      // Do not refetch automatically when switching browser tabs
      refetchOnWindowFocus: false,
      // Refetch on reconnecting network
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0,
    },
  },
});
