import { ClientConfig } from "../AppConfig/ClientConfig";

import { Realtime } from "ably";

let realtimeClient: Realtime | undefined;

export const listen = async ({
  channelName,
  eventName,
  onMessage,
  onConnected,
}: {
  channelName: string;
  eventName: string;
  onMessage: (date: any) => void;
  onConnected: () => void;
}) => {
  const ablyApiKey = ClientConfig.ENV.NEXT_PUBLIC_ABLY_API_KEY;
  if (!ablyApiKey) {
    console.error(
      "NEXT_PUBLIC_ABLY_API_KEY is not provided in .env.local, ably client will not be initialised"
    );
    return;
  }

  //initialise and connect to Ably with api key
  const ably = new Realtime(ablyApiKey);
  realtimeClient = ably;
  await ably.connection.once("connected");

  const channel = ably.channels.get(channelName);

  //subscribe to a channel.
  channel.unsubscribe(eventName);
  channel.subscribe(eventName, (message) => onMessage(message.data));

  onConnected();
  return close;
};

export const close = () => {
  if (realtimeClient) {
    realtimeClient.close();
  }
};

export const sendMessage = async ({
  channelName,
  eventName,
  message,
}: {
  channelName: string;
  eventName: string;
  message: any;
}) => {
  if (realtimeClient) {
    const channel = realtimeClient.channels.get(channelName);
    return channel.publish(eventName, message);
  }
};

export const realTimeClient = {
  listen,
  sendMessage,
  close,
};
