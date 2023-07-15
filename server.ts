//custom server based on https://nextjs.org/docs/advanced-features/custom-server
//added local ssl cert config

import { createServer } from "https";
import { parse } from "url";
import next from "next";
import fs from "fs";
import { createWebSocketServer } from "./lib/server/websocketServer";
// Load environment variables from .env, .env.local, etc. This explicit call
// into `@next/env` allows using environment variables before next() is called.
// More info: https://nextjs.org/docs/basic-features/environment-variables
import { loadEnvConfig } from "@next/env";
loadEnvConfig("./", process.env.NODE_ENV !== "production");

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.NEXT_PUBLIC_BASE_URL || "localhost";
const port = 3000;
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync("./cert/development-key.pem"),
  cert: fs.readFileSync("./cert/development-cert.pem"),
};

app.prepare().then(() => {
  const server = createServer(httpsOptions, async (req, res) => {
    try {
      const { url } = req;
      if (!url) {
        return;
      }
      const parsedUrl = parse(url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  });

  createWebSocketServer(server); // Initialize the WebSocket server

  server.listen(port, () => {
    console.log(`> FenceLane Server ready on ${hostname}`);
    return;
  });
});
