import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "../apiClient";
import { QUERY_KEY, queryClient } from "../queryClient";
import { OrderInfo } from "../../types";

export const useGetEurRate = () => {
  const mutation = useQuery({
    queryFn: () => apiClient.calcs.getEurRate(),
  });

  return mutation;
};
export const useGetOrderTransportCost = (id: number) => {
  const mutation = useQuery({
    queryFn: () => apiClient.calcs.getOrderTransportCost(id),
    queryKey: [QUERY_KEY.ORDER, id, QUERY_KEY.TRANSPORT_COST],
  });

  return mutation;
};
export const useGetOrderExpanses = (id: number) => {
  const mutation = useQuery({
    queryFn: () => apiClient.calcs.getOrderExpanses(id),
    queryKey: [QUERY_KEY.ORDER, id, QUERY_KEY.EXPANSES],
  });

  return mutation;
};
export const usePostOrderExpanses = (onSuccess: () => void) => {
  const mutation = useMutation({
    mutationFn: apiClient.calcs.postOrderExpanses,
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.ORDER, QUERY_KEY.EXPANSES],
      });
    },
  });

  return mutation;
};

export const usePostOrderTransportCost = (onSuccess: () => void) => {
  const mutation = useMutation({
    mutationFn: apiClient.calcs.postOrderTransportCost,
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.ORDER, QUERY_KEY.TRANSPORT_COST],
      });
    },
  });

  return mutation;
};

export const useUpdateStatus = (orderId: number) => {
  const mutation = useMutation({
    mutationFn: (data: Partial<OrderInfo>) =>
      apiClient.orders.updateOrder({ id: orderId, data }),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.ORDER, orderId],
      });
    },
  });

  return mutation;
};
