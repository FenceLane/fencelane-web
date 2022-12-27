import CryptoJS from "crypto-js";
import { ServerConfig } from "../../AppConfig/ServerConfig";

export const encryptPassword = (value: string) => {
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
