import WebSocket from "ws";

declare global {
  var webSocketServer: WebSocket.Server;
}
