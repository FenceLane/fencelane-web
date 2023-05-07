import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../apiClient";
import { QUERY_KEY } from "../queryClient";

export const useGetEvents = () => {
  const mutation = useQuery({
    queryFn: () => apiClient.events.getEvents(),
    queryKey: [QUERY_KEY.EVENTS],
  });

  return mutation;
};
