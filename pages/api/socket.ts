// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { withApiMethods } from "../../lib/server/middlewares/withApiMethods";
import WebSocket from "ws";
import { getWebSocketServer } from "../../lib/server/websocketServer";

export default withApiMethods({
  GET: async (req: NextApiRequest, res: NextApiResponse) => {
    const webSocketServer = getWebSocketServer();

    webSocketServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send("Hello, WebSocket client!");
      }
    });

    res.status(200).json({ message: "WebSocket message sent." });
  },
});
