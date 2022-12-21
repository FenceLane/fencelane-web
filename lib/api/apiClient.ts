import axios from "axios";
import { CONTENT_TYPE } from "../server/middlewares/withValidatedJSONRequestBody";
import { ServerConfig } from "../server/ServerConfig";

const apiPath = (endpoint: string) => {
  const baseUrl = "http://localhost:3000";
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
