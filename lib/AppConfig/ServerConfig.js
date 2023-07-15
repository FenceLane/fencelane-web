"use strict";
exports.__esModule = true;
exports.ServerConfig = void 0;
var getEncryptionSecret = function () {
  var secret = process.env.ENCRYPTION_SECRET;
  if (!secret) {
    throw new Error(
      "Required ENCRYPTION_SECRET env variable was not provided."
    );
  }
  return secret;
};
exports.ServerConfig = {
  ENV: {
    ENCRYPTION_SECRET: getEncryptionSecret(),
    REQUIRE_HTTPS: process.env.REQUIRE_HTTPS
      ? process.env.REQUIRE_HTTPS === "true"
      : true,
  },
};
