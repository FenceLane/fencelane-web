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

const postRegister = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  return axios.post(apiPath("auth/register"), data);
};

const deleteLogout = async () => {
  return axios.delete(apiPath("auth/logout"));
};

const deleteSelfUser = async () => {
  return axios.delete(apiPath("auth/delete"));
};

const getMe = async () => {
  return axios.get(apiPath("auth/me"));
};

export const apiClient = {
  auth: {
    postLogin,
    postRegister,
    deleteLogout,
    deleteSelfUser,
    getMe,
  },
};
