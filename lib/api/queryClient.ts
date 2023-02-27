import { QueryClient } from "@tanstack/react-query";

const MINUTE_IN_MS = 1000 * 60;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      refetchOnWindowFocus: false,
      retryDelay: (attemptIndex) =>
        Math.min(1000 * 2 ** attemptIndex, MINUTE_IN_MS), //double retry time every attempt (but <= 2 mins)
    },
  },
});
export { queryClient };

export const QUERY_KEY = {
  PRODUCTS: "products",
  ORDERS: "orders",
};
