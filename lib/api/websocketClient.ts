import ReconnectingWebSocket, {
  CloseEvent,
  ErrorEvent,
  Event,
  Message,
} from "reconnecting-websocket";
import { ClientConfig } from "../AppConfig/ClientConfig";

let rwsClient: ReconnectingWebSocket | undefined;

export const initialiseWebSocketClient = ({
  onOpen,
  onMessage,
  onClose,
  onError,
}: {
  onOpen: (event: Event) => void;
  onMessage: (event: MessageEvent<any>) => void;
  onClose: (event: CloseEvent) => void;
  onError: (event: ErrorEvent) => void;
}) => {
  const socketUrl = ClientConfig.ENV.NEXT_PUBLIC_BASE_URL_WSS;
  if (!socketUrl) {
    throw new Error("NEXT_PUBLIC_BASE_URL_WSS is not defined in .env.local");
  }

  rwsClient = new ReconnectingWebSocket(socketUrl, undefined, {
    debug: true,
  });
  rwsClient.onopen = onOpen;
  rwsClient.onmessage = onMessage;
  rwsClient.onclose = onClose;
  rwsClient.onerror = onError;
};

export const getWebSocketClient = () => {
  return rwsClient;
};

export const closeWebSocketClient = () => {
  if (rwsClient) {
    rwsClient.close();
  }
};

export const sendWebsocketMessage = (message: Message) => {
  if (rwsClient) {
    rwsClient.send(message);
  }
};
