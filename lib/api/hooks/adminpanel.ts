import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "../apiClient";
import { QUERY_KEY, invalidateQueriesWithWebsocket } from "../queryClient";

export const useDeleteRegisterToken = (onSuccess: () => void) => {
  const mutation = useMutation({
    mutationFn: apiClient.register_token.deleteRegisterToken,
    onSuccess: () => {
      onSuccess();
      invalidateQueriesWithWebsocket({ queryKey: [QUERY_KEY.REGISTER_TOKEN] });
    },
  });

  return mutation;
};

export const useGetRegisterToken = () => {
  const mutation = useQuery({
    queryFn: () => apiClient.register_token.getRegisterToken(),
    queryKey: [QUERY_KEY.REGISTER_TOKEN],
  });

  return mutation;
};

export const usePostRegisterToken = (onSuccess: () => void) => {
  const mutation = useMutation({
    mutationFn: apiClient.register_token.postRegisterToken,
    onSuccess: () => {
      onSuccess();
      invalidateQueriesWithWebsocket({ queryKey: [QUERY_KEY.REGISTER_TOKEN] });
    },
  });

  return mutation;
};
