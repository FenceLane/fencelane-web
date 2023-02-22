import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "../apiClient";
import { queryClient, QUERY_KEY } from "../queryClient";

export const useGetProducts = () => {
  const mutation = useQuery({
    queryFn: () => apiClient.products.getProducts(),
    queryKey: [QUERY_KEY.PRODUCTS],
  });

  return mutation;
};

export const usePostProduct = () => {
  const mutation = useMutation({
    mutationFn: apiClient.products.postProduct,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.PRODUCTS] }),
  });

  return mutation;
};
