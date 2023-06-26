import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "../apiClient";
import { QUERY_KEY, invalidateQueriesWithWebsocket } from "../queryClient";

export const useGetEurRate = () => {
  const mutation = useQuery({
    queryFn: () => apiClient.calcs.getEurRate(),
  });

  return mutation;
};
export const useGetOrderTransportCost = (id: number) => {
  const mutation = useQuery({
    queryFn: () => apiClient.calcs.getOrderTransportCost(id),
    queryKey: [id, QUERY_KEY.TRANSPORT_COST],
  });

  return mutation;
};
export const useGetOrderExpanses = (id: number) => {
  const mutation = useQuery({
    queryFn: () => apiClient.calcs.getOrderExpanses(id),
    queryKey: [id, QUERY_KEY.EXPANSES],
  });

  return mutation;
};
export const usePostOrderExpanses = (
  orderId: number,
  onSuccess?: () => void
) => {
  const mutation = useMutation({
    mutationFn: apiClient.calcs.postOrderExpanses,
    onSuccess: () => {
      onSuccess?.();
      return Promise.all([
        invalidateQueriesWithWebsocket({
          queryKey: [QUERY_KEY.ORDER, orderId],
        }),
        invalidateQueriesWithWebsocket({ queryKey: [QUERY_KEY.EXPANSES] }),
        invalidateQueriesWithWebsocket({ queryKey: [QUERY_KEY.ORDERS] }),
      ]);
    },
  });

  return mutation;
};

export const usePostOrderTransportCost = (
  orderId: number,
  onSuccess?: () => void
) => {
  const mutation = useMutation({
    mutationFn: apiClient.calcs.postOrderTransportCost,
    onSuccess: () => {
      onSuccess?.();
      return Promise.all([
        invalidateQueriesWithWebsocket({
          queryKey: [QUERY_KEY.ORDER, orderId],
        }),
        invalidateQueriesWithWebsocket({
          queryKey: [QUERY_KEY.TRANSPORT_COST],
        }),
        invalidateQueriesWithWebsocket({ queryKey: [QUERY_KEY.ORDERS] }),
      ]);
    },
  });

  return mutation;
};

export const useDeleteExpanses = (orderId: number) => {
  const mutation = useMutation({
    mutationFn: () => apiClient.calcs.deleteExpanses(orderId),
    onSuccess: () => {
      return Promise.all([
        invalidateQueriesWithWebsocket({
          queryKey: [QUERY_KEY.ORDER, orderId],
        }),
        invalidateQueriesWithWebsocket({ queryKey: [QUERY_KEY.EXPANSES] }),
      ]);
    },
  });
  return mutation;
};

export const useDeleteTransportCost = (orderId: number) => {
  const mutation = useMutation({
    mutationFn: () => apiClient.calcs.deleteTransportCost(orderId),
    onSuccess: () => {
      return Promise.all([
        invalidateQueriesWithWebsocket({
          queryKey: [QUERY_KEY.ORDER, orderId],
        }),
        invalidateQueriesWithWebsocket({
          queryKey: [QUERY_KEY.TRANSPORT_COST],
        }),
      ]);
    },
  });
  return mutation;
};
