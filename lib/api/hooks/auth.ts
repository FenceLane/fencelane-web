import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../apiClient";

export const usePostLogin = () => {
  const mutation = useMutation({
    mutationFn: apiClient.postLogin,
    cacheTime: 0,
  });

  return mutation;
};
