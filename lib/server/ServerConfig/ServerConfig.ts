const getEncryptionSecret = () => {
  const secret = process.env.ENCRYPTION_SECRET;
  if (!secret) {
    throw new Error(
      "Required ENCRYPTION_SECRET env variable was not provided."
    );
  }
  return secret;
};

export class ServerConfig {
  static ENV = {
    ENCRYPTION_SECRET: getEncryptionSecret(),
  };
}
