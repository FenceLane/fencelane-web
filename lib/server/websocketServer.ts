import WebSocket from "ws";
import { Server as HttpsServer } from "https";
import { parse } from "url";
import { parseCookieHeader } from "./utils/cookieSessionUtils";

const hardClose = (socket: WebSocket) => {
  // Soft close
  socket.close();

  process.nextTick(() => {
    const closing = [socket.OPEN, socket.CLOSING] as number[];
    const readyState = socket.readyState;
    if (closing.includes(readyState)) {
      // Socket still hangs, hard close
      socket.terminate();
    }
  });
};

export const createWebSocketServer = (server: HttpsServer) => {
  const webSocketServer = new WebSocket.Server({ noServer: true });

  webSocketServer.on("connection", async function connection(ws, req) {
    const cookies = parseCookieHeader(req.headers.cookie || "");
    const sessionId = cookies.authorization;
    if (!sessionId) {
      hardClose(ws);
      return;
    }

    console.log(
      "Client connected, connected clients:",
      webSocketServer.clients.size
    );

    ws.onclose = () => {
      console.log(
        "Client closed connection, connected clients:",
        webSocketServer.clients.size
      );
    };
  });

  server.on("upgrade", (req, socket, head) => {
    const { url } = req;
    if (!url) {
      return;
    }
    const { pathname } = parse(url, true);
    if (pathname !== "/_next/webpack-hmr") {
      webSocketServer.handleUpgrade(req, socket, head, (ws) => {
        webSocketServer.emit("connection", ws, req);
      });
    }
  });

  global.webSocketServer = webSocketServer;
};

export const getWebSocketServer = (): WebSocket.Server => {
  return global.webSocketServer;
};
