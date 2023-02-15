import axios from "axios";
import { ClientConfig } from "../AppConfig/ClientConfig";
import { USER_ROLE } from "../types";

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

const postRegister = async ({
  name,
  email,
  phone,
  role = USER_ROLE.USER,
  password,
}: {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: USER_ROLE;
}) => {
  return axios.post(apiPath("auth/register"), {
    name,
    email,
    phone,
    role,
    password,
  });
};

const putCompletePasswordReset = async (data: {
  password: string;
  token: string;
}) => {
  return axios.put(apiPath("auth/password-reset/complete"), data);
};

const postInitialisePasswordReset = async (data: { email: string }) => {
  return axios.post(apiPath("auth/password-reset"), data);
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

const getProducts = async () => {
  return axios.get(apiPath("products"));
};

export const apiClient = {
  auth: {
    postLogin,
    postRegister,
    postInitialisePasswordReset,
    putCompletePasswordReset,
    deleteLogout,
    deleteSelfUser,
    getMe,
    getProducts,
  },
};
