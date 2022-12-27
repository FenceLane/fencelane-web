const getEncryptionSecret = () => {
  const secret = process.env.ENCRYPTION_SECRET;
  if (!secret) {
    throw new Error(
      "Required ENCRYPTION_SECRET env variable was not provided."
    );
  }
  return secret;
};

export const ServerConfig = {
  ENV: {
    ENCRYPTION_SECRET: getEncryptionSecret(),
    REQUIRE_HTTPS: process.env.REQUIRE_HTTPS
      ? process.env.REQUIRE_HTTPS === "true"
      : true,
  },
};
