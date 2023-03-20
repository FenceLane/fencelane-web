import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "../apiClient";
import { queryClient, QUERY_KEY } from "../queryClient";

export const useGetOrders = () => {
  const mutation = useQuery({
    queryFn: () => apiClient.orders.getOrders(),
    queryKey: [QUERY_KEY.ORDERS],
  });

  return mutation;
};

export const useGetOrder = (id: String) => {
  const mutation = useQuery({
    queryFn: () => apiClient.orders.getOrder(id),
    queryKey: [QUERY_KEY.ORDER, id],
  });

  return mutation;
};

export const usePostOrder = (onSuccess: () => void) => {
  const mutation = useMutation({
    mutationFn: apiClient.orders.postOrder,
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries([QUERY_KEY.ORDERS, QUERY_KEY.PRODUCTS]);
    },
  });

  return mutation;
};

export const useGetClients = () => {
  const mutation = useQuery({
    queryFn: () => apiClient.orders.getClients(),
    queryKey: [QUERY_KEY.CLIENTS],
  });

  return mutation;
};

export const useGetDestinations = () => {
  const mutation = useQuery({
    queryFn: () => apiClient.orders.getDestinations(),
    queryKey: [QUERY_KEY.DESTINATIONS],
  });

  return mutation;
};
