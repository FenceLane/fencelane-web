import { decryptStringAES, encryptStringAES } from "./CryptographyService";

jest.mock("../../AppConfig/ServerConfig", () => ({
  ServerConfig: {
    ENV: { ENCRYPTION_SECRET: "123" },
  },
}));

describe("PasswordCrypto", () => {
  it("encrypts and decrypts password", () => {
    const password = "Patryk123";
    const encrypted = encryptStringAES(password);
    const decrypted = decryptStringAES(encrypted);

    expect(decrypted).toEqual(password);
  });

  it("encrypts and decrypts when using special symbols", () => {
    const password = [`!@#$%^&*()_+}{1234567890-=[];'\:"|/.,<>?~`, "`"].join(
      ""
    );
    const encrypted = encryptStringAES(password);
    const decrypted = decryptStringAES(encrypted);

    expect(decrypted).toEqual(password);
  });
});
