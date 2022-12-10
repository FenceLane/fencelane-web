import CryptoJS from "crypto-js";
import { ServerConfig } from "../ServerConfig";

export const encryptPassword = (value: string) => {
  console.log(ServerConfig.ENV.ENCRYPTION_SECRET);
  return CryptoJS.AES.encrypt(
    value,
    ServerConfig.ENV.ENCRYPTION_SECRET
  ).toString();
};

export const decryptPassword = (value: string) => {
  return CryptoJS.AES.decrypt(
    value,
    ServerConfig.ENV.ENCRYPTION_SECRET
  ).toString(CryptoJS.enc.Utf8);
};
