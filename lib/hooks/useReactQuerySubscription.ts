import { useEffect } from "react";
import { apiClient } from "../api/apiClient";
import { queryClient } from "../api/queryClient";

const socketLogger = {
  info: (message: string, obj?: any) => {
    if (!obj) {
      return console.info(`%c ${message}`, "color: #bada55");
    }
    return console.info(`%c ${message}`, "color: #bada55", obj);
  },
  error: (message: string, obj?: any) =>
    console.info(`%c ${message}`, "color: #e33270", obj),
};

export const useReactQueryWebsocketSocketSubscription = (userId?: string) => {
  useEffect(() => {
    //this effect will run every time userId changes
    //so basically when user logs in or logs out
    //we want to allow only logged in users to listen to socket
    //if user is logged in we want to listen to socket
    //if user is logged out we want to close socket

    if (!userId) {
      return apiClient.queryKeys.close();
    }

    apiClient.queryKeys.listen({
      onQueryKeyArrived: (queryKey) => {
        socketLogger.info("FenceLane realtime query updated:", queryKey);
        queryClient.invalidateQueries({ queryKey });
      },
      onConnected: () => {
        socketLogger.info("FenceLane realtime query connected");
      },
    });

    return () => apiClient.queryKeys.close();
  }, [userId]);
};
