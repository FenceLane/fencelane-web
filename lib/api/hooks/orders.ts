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

export const usePostOrder = (onSuccess: () => void) => {
  const mutation = useMutation({
    mutationFn: apiClient.orders.postOrder,
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.ORDERS] });
    },
  });

  return mutation;
};
