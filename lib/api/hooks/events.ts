import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "../apiClient";
import { QUERY_KEY, queryClient } from "../queryClient";

export const useGetEvents = () => {
  const mutation = useQuery({
    queryFn: () => apiClient.events.getEvents(),
    queryKey: [QUERY_KEY.EVENTS],
  });

  return mutation;
};

export const usePostEvent = (onSuccess: () => void) => {
  const mutation = useMutation({
    mutationFn: apiClient.events.postEvent,
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.EVENTS] });
    },
  });

  return mutation;
};

export const useDeleteEvent = (onSuccess: () => void) => {
  const mutation = useMutation({
    mutationFn: apiClient.events.deleteEvent,
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.EVENTS] });
    },
  });

  return mutation;
};

export const useUpdateEvent = (onSuccess: () => void) => {
  const mutation = useMutation({
    mutationFn: apiClient.events.updateEvent,
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.EVENTS] });
    },
  });

  return mutation;
};
