import { useMutation, useQuery } from "@tanstack/react-query";
import { OrderStatusData } from "../../schema/orderStatusData";
import { apiClient } from "../apiClient";
import { queryClient, QUERY_KEY } from "../queryClient";
import { OrderProductInfo } from "../../types";

export const useGetOrders = () => {
  const mutation = useQuery({
    queryFn: () => apiClient.orders.getOrders(),
    queryKey: [QUERY_KEY.ORDERS],
  });

  return mutation;
};

export const useGetOrder = (id: number) => {
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
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY.ORDERS] }),
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY.PRODUCTS] }),
      ]);
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

export const useUpdateStatus = (orderId: number, onSuccess: () => void) => {
  const mutation = useMutation({
    mutationFn: (data: OrderStatusData) =>
      apiClient.orders.updateStatus({ id: orderId, data }),
    onSuccess: () => {
      onSuccess();
      return queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.ORDER, orderId],
      });
    },
  });

  return mutation;
};

export const useUpdateOrderProducts = (
  orderId: number,
  onSuccess: () => void
) => {
  const mutation = useMutation({
    mutationFn: (data: Partial<OrderProductInfo>[]) =>
      apiClient.orders.updateOrderProducts({ id: orderId, data }),
    onSuccess: () => {
      onSuccess();
      return queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.ORDER, orderId],
      });
    },
  });

  return mutation;
};
