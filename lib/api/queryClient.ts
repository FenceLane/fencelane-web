import { QueryClient, QueryKey } from "@tanstack/react-query";
import { apiClient } from "./apiClient";

const MINUTE_IN_MS = 1000 * 60;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      retryDelay: (attemptIndex) =>
        Math.min(1000 * 2 ** attemptIndex, MINUTE_IN_MS), //double retry time every attempt (but <= 2 mins)
    },
  },
});

export const invalidateQueriesWithWebsocket = ({
  queryKey,
}: {
  queryKey: QueryKey;
}) => {
  try {
    const data = JSON.stringify(queryKey);
    apiClient.socket.send(data);
  } catch {}
  return queryClient.invalidateQueries(queryKey);
};

export const QUERY_KEY = {
  PRODUCTS: "products",
  PRODUCTS_CATEGORIES: "products/categories",
  ORDERS: "orders",
  ORDER: "order",
  ORDERS_BY_PARENT_ORDER_ID: "orders/parentOrderId",
  CLIENTS: "clients",
  DESTINATIONS: "destinations",
  STATUS: "status",
  EXPANSES: "expanses",
  TRANSPORT_COST: "transport/cost",
  EVENTS: "events",
  EMPLOYEES: "employees",
  COMMISSIONS: "commissions",
};
