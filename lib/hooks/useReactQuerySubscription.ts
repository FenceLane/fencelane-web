import { useEffect } from "react";
import { apiClient } from "../api/apiClient";

const socketLogger = {
  info: (message: string, obj?: any) =>
    console.info(`%c ${message}`, "color: #bada55", obj),
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
      return apiClient.socket.close();
    }

    apiClient.socket.listen({
      onOpen: (event) => {
        socketLogger.info("FenceLane Socket established:", event);
      },
      onMessage: (event) => {
        socketLogger.info("FenceLane Socket message:", event.data);
        // websocket.onmessage = (event) => {
        //   const data = JSON.parse(event.data);
        //   const queryKey = [...data.entity, data.id].filter(Boolean);
        //   queryClient.invalidateQueries({ queryKey });
        // };
      },
      onClose: (event) => {
        socketLogger.info("FenceLane Socket closed:", event);
      },
      onError: (event) => {
        socketLogger.error("FenceLane Socket error:", event);
      },
    });

    return () => apiClient.socket.close();
  }, [userId]);
};
