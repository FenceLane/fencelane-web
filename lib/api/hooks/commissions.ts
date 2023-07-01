import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../apiClient";
import { QUERY_KEY } from "../queryClient";

export const useGetCommissions = () => {
  const mutation = useQuery({
    queryFn: () => apiClient.commissions.getCommissions(),
    queryKey: [QUERY_KEY.COMMISSIONS],
  });

  return mutation;
};
