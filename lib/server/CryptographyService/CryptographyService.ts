import CryptoJS from "crypto-js";
import { ServerConfig } from "../../AppConfig/ServerConfig";
import crypto from "crypto";

export const encryptStringAES = (value: string) => {
  return CryptoJS.AES.encrypt(
    value,
    ServerConfig.ENV.ENCRYPTION_SECRET
  ).toString();
};

export const decryptStringAES = (value: string) => {
  return CryptoJS.AES.decrypt(
    value,
    ServerConfig.ENV.ENCRYPTION_SECRET
  ).toString(CryptoJS.enc.Utf8);
};

export const encryptStringSHA256 = (value: string) => {
  return CryptoJS.SHA256(value).toString();
};

export const getRandomString = (bytes: number) =>
  crypto.randomBytes(bytes).toString("hex");
