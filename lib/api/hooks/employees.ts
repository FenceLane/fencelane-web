import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "../apiClient";
import { QUERY_KEY, invalidateQueriesWithWebsocket } from "../queryClient";
import { USER_ROLE } from "../../../lib/types";

export const useGetEmployees = () => {
  const mutation = useQuery({
    queryFn: () => apiClient.employees.getEmployees(),
    queryKey: [QUERY_KEY.EMPLOYEES],
  });

  return mutation;
};

export const useChangeRole = (userId: string, onSuccess: () => void) => {
  const mutation = useMutation({
    mutationFn: (data: { role: USER_ROLE }) =>
      apiClient.employees.changeRole({ id: userId, data }),
    onSuccess: () => {
      onSuccess();
      return invalidateQueriesWithWebsocket({
        queryKey: [QUERY_KEY.EMPLOYEES],
      });
    },
  });

  return mutation;
};
