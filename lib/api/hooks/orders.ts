import { useMutation, useQuery } from "@tanstack/react-query";
import { OrderStatusData } from "../../schema/orderStatusData";
import { apiClient } from "../apiClient";
import { QUERY_KEY, invalidateQueriesWithWebsocket } from "../queryClient";
import { OrderInfo, OrderProductInfo } from "../../types";

export const useGetOrders = () => {
  const mutation = useQuery({
    queryFn: () => apiClient.orders.getOrders(),
    queryKey: [QUERY_KEY.ORDERS],
  });

  return mutation;
};

export const useGetOrdersByParentOrderId = () => {
  const mutation = useQuery({
    queryFn: () => apiClient.orders.getOrdersByParentOrderId(),
    queryKey: [QUERY_KEY.ORDERS, QUERY_KEY.ORDERS_BY_PARENT_ORDER_ID],
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

export const usePostOrder = () => {
  const mutation = useMutation({
    mutationFn: apiClient.orders.postOrder,
    onSuccess: () => {
      return Promise.all([
        invalidateQueriesWithWebsocket({ queryKey: [QUERY_KEY.ORDERS] }),
        invalidateQueriesWithWebsocket({ queryKey: [QUERY_KEY.PRODUCTS] }),
        invalidateQueriesWithWebsocket({ queryKey: [QUERY_KEY.COMMISSIONS] }),
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
export const useUpdateStatus = (orderId: number, onSuccess: () => void) => {
  const mutation = useMutation({
    mutationFn: (data: OrderStatusData) =>
      apiClient.orders.updateStatus({ id: orderId, data }),
    onSuccess: () => {
      onSuccess();

      return Promise.all([
        invalidateQueriesWithWebsocket({ queryKey: [QUERY_KEY.ORDERS] }),
        invalidateQueriesWithWebsocket({
          queryKey: [QUERY_KEY.ORDER, orderId],
        }),
      ]);
    },
  });

  return mutation;
};

export const useUpdateOrderProducts = (
  orderId: number,
  onSuccess: (orderProducts: Partial<OrderProductInfo>[]) => void
) => {
  const mutation = useMutation({
    mutationFn: (data: Partial<OrderProductInfo>[]) =>
      apiClient.orders.updateOrderProducts({ id: orderId, data }),
    onSuccess: (_data, variables) => {
      onSuccess(variables);
      return Promise.all([
        invalidateQueriesWithWebsocket({ queryKey: [QUERY_KEY.ORDERS] }),
        invalidateQueriesWithWebsocket({
          queryKey: [QUERY_KEY.ORDER, orderId],
        }),
      ]);
    },
  });

  return mutation;
};

export const useUpdateOrder = (orderId: number) => {
  const mutation = useMutation({
    mutationFn: (data: Partial<OrderInfo>) =>
      apiClient.orders.updateOrder({ id: orderId, data }),
    onSuccess: () => {
      return Promise.all([
        invalidateQueriesWithWebsocket({ queryKey: [QUERY_KEY.ORDERS] }),
        invalidateQueriesWithWebsocket({ queryKey: [QUERY_KEY.COMMISSIONS] }),
        invalidateQueriesWithWebsocket({
          queryKey: [QUERY_KEY.ORDER, orderId],
        }),
      ]);
    },
  });

  return mutation;
};

export const usePostClient = () => {
  const mutation = useMutation({
    mutationFn: apiClient.orders.postClient,
    onSuccess: () => {
      invalidateQueriesWithWebsocket({
        queryKey: [QUERY_KEY.CLIENTS],
      });
    },
  });

  return mutation;
};

export const usePostDestination = () => {
  const mutation = useMutation({
    mutationFn: apiClient.orders.postDestination,
    onSuccess: () => {
      return Promise.all([
        invalidateQueriesWithWebsocket({ queryKey: [QUERY_KEY.CLIENTS] }),
        invalidateQueriesWithWebsocket({ queryKey: [QUERY_KEY.DESTINATIONS] }),
      ]);
    },
  });

  return mutation;
};

export const usePostOrderFile = (orderId: number) => {
  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      apiClient.orders.postOrderFile({ id: orderId, data }),
    onSuccess: () => {
      return Promise.all([
        invalidateQueriesWithWebsocket({
          queryKey: [QUERY_KEY.ORDER, orderId],
        }),
        invalidateQueriesWithWebsocket({ queryKey: [QUERY_KEY.ORDERS] }),
        invalidateQueriesWithWebsocket({ queryKey: [QUERY_KEY.COMMISSIONS] }),
      ]);
    },
  });

  return mutation;
};

export const useDeleteOrderFile = (orderId: number, key: string) => {
  const mutation = useMutation({
    mutationFn: () => apiClient.orders.deleteOrderFile({ id: orderId, key }),
    onSuccess: () => {
      return Promise.all([
        invalidateQueriesWithWebsocket({
          queryKey: [QUERY_KEY.ORDER, orderId],
        }),
        invalidateQueriesWithWebsocket({ queryKey: [QUERY_KEY.ORDERS] }),
        invalidateQueriesWithWebsocket({ queryKey: [QUERY_KEY.COMMISSIONS] }),
      ]);
    },
  });

  return mutation;
};
