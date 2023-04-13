import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../apiClient";
import { QUERY_KEY } from "../queryClient";

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
