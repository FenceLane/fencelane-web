import axios from "axios";
import { ClientConfig } from "../AppConfig/ClientConfig";

const apiPath = (endpoint: string) => {
  const baseUrl = ClientConfig.ENV.NEXT_PUBLIC_BASE_URL;

  if (!baseUrl) {
    throw new Error(`NEXT_PUBLIC_BASE_URL env variable was not set!`);
  }
  return `${baseUrl}/api/${endpoint}`;
};

const postLogin = async (data: { email: string; password: string }) => {
  return axios.post(apiPath("auth/login"), data);
};

export const apiClient = {
  postLogin,
};
