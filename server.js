//custom server based on https://nextjs.org/docs/advanced-features/custom-server
//added local ssl cert config
const { createServer } = require("https");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");

// Load environment variables from .env, .env.local, etc. This explicit call
// into `@next/env` allows using environment variables before next() is called.
// More info: https://nextjs.org/docs/basic-features/environment-variables
const { loadEnvConfig } = require("@next/env");
loadEnvConfig("./", process.env.NODE_ENV !== "production");

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.NEXT_PUBLIC_BASE_URL || "localhost";
const port = 3000;
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

console.log(process.env);

const httpsOptions = {
  key: fs.readFileSync("./cert/development-key.pem"),
  cert: fs.readFileSync("./cert/development-cert.pem"),
};

app.prepare().then(() => {
  createServer(httpsOptions, async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> FenceLane ready on https://${hostname}:${port}`);
  });
});
