import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../apiClient";

export const useGetEurRate = () => {
  const mutation = useQuery({
    queryFn: () => apiClient.calcs.getEurRate(),
  });

  return mutation;
};
