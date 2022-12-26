import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../apiClient";

export const usePostLogin = () => {
  const mutation = useMutation({
    mutationFn: apiClient.auth.postLogin,
    cacheTime: 0,
  });

  return mutation;
};

export const usePostRegister = () => {
  const mutation = useMutation({
    mutationFn: apiClient.auth.postRegister,
    cacheTime: 0,
  });

  return mutation;
};
