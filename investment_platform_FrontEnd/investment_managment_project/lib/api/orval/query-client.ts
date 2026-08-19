import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

const makeQueryClient = cache(() => new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
      retryDelay: (attemptIndex) =>
        Math.min(1000 * 2 ** attemptIndex, 30_000),
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
}));

export function getQueryClient(): QueryClient {
  if (typeof window !== "undefined") {
    throw new Error(
      "getQueryClient() is for Server Components only. " +
        "On the client, use QueryProvider which owns the QueryClient.",
    );
  }
  return makeQueryClient();
}
