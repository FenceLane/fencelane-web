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
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.PRODUCTS] });
    },
  });

  return mutation;
};

export const useEditProduct = (onSuccess: () => void) => {
  const mutation = useMutation({
    mutationFn: apiClient.products.editProduct,
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.PRODUCTS] });
    },
  });

  return mutation;
};

export const useTransferVariant = (onSuccess: () => void) => {
  const mutation = useMutation({
    mutationFn: apiClient.products.transferVariant,
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.PRODUCTS] });
    },
  });

  return mutation;
};

export const useDeleteProduct = (onSuccess: () => void) => {
  const mutation = useMutation({
    mutationFn: apiClient.products.deleteProduct,
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.PRODUCTS] });
    },
  });
  return mutation;
};
