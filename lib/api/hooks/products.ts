import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "../apiClient";
import { QUERY_KEY, invalidateQueriesWithWebsocket } from "../queryClient";

export const useGetProducts = () => {
  const mutation = useQuery({
    queryFn: () => apiClient.products.getProducts(),
    queryKey: [QUERY_KEY.PRODUCTS],
  });

  return mutation;
};

export const useGetProductsCategories = () => {
  const mutation = useQuery({
    queryFn: () => apiClient.products.getProductsCategories(),
    queryKey: [QUERY_KEY.PRODUCTS_CATEGORIES],
  });

  return mutation;
};

export const usePostProduct = (onSuccess: () => void) => {
  const mutation = useMutation({
    mutationFn: apiClient.products.postProduct,
    onSuccess: () => {
      onSuccess();
      invalidateQueriesWithWebsocket({ queryKey: [QUERY_KEY.PRODUCTS] });
    },
  });

  return mutation;
};

export const useEditProduct = (onSuccess: () => void) => {
  const mutation = useMutation({
    mutationFn: apiClient.products.editProduct,
    onSuccess: () => {
      onSuccess();
      invalidateQueriesWithWebsocket({ queryKey: [QUERY_KEY.PRODUCTS] });
    },
  });

  return mutation;
};

export const useDeleteProduct = (onSuccess: () => void) => {
  const mutation = useMutation({
    mutationFn: apiClient.products.deleteProduct,
    onSuccess: () => {
      onSuccess();
      invalidateQueriesWithWebsocket({ queryKey: [QUERY_KEY.PRODUCTS] });
    },
  });
  return mutation;
};
