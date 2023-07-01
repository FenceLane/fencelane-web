import { useMutation, useQuery } from "@tanstack/react-query";

import { apiClient } from "../apiClient";
import { QUERY_KEY, invalidateQueriesWithWebsocket } from "../queryClient";

export const useGetCommissions = () => {
  const mutation = useQuery({
    queryFn: () => apiClient.commissions.getCommissions(),
    queryKey: [QUERY_KEY.COMMISSIONS, QUERY_KEY.ORDERS],
  });

  return mutation;
};

export const useUpdateCommissionProducts = (orderId: number) => {
  const mutation = useMutation({
    mutationFn: (
      data: { filledQuantity: number; productCommissionId: string }[]
    ) => apiClient.commissions.updateCommissionProducts({ id: orderId, data }),
    onSuccess: (_data) => {
      return Promise.all([
        invalidateQueriesWithWebsocket({
          queryKey: [QUERY_KEY.COMMISSIONS],
        }),
        invalidateQueriesWithWebsocket({
          queryKey: [QUERY_KEY.PRODUCTS],
        }),
      ]);
    },
  });

  return mutation;
};

export const usePostCommission = () => {
  const mutation = useMutation({
    mutationFn: apiClient.commissions.postCommission,
    onSuccess: () => {
      invalidateQueriesWithWebsocket({ queryKey: [QUERY_KEY.COMMISSIONS] });
    },
  });

  return mutation;
};
