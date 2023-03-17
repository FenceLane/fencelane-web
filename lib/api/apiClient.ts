import axios from "axios";
import { ClientConfig } from "../AppConfig/ClientConfig";
import { ProductInfo, USER_ROLE } from "../types";
import https from "https";
import { ProductDataCreate, ProductDataUpdate } from "../schema/productData";

const axiosInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

const apiPath = (endpoint: string) => {
  const baseUrl = ClientConfig.ENV.NEXT_PUBLIC_BASE_URL;

  if (!baseUrl) {
    throw new Error(`NEXT_PUBLIC_BASE_URL env variable was not set!`);
  }
  return `${baseUrl}/api/${endpoint}`;
};

const postLogin = async (data: { email: string; password: string }) => {
  return axiosInstance.post(apiPath("auth/login"), data);
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
  return axiosInstance.post(apiPath("auth/register"), {
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
  return axiosInstance.put(apiPath("auth/password-reset/complete"), data);
};

const postInitialisePasswordReset = async (data: { email: string }) => {
  return axiosInstance.post(apiPath("auth/password-reset"), data);
};

const deleteLogout = async () => {
  return axiosInstance.delete(apiPath("auth/logout"));
};

const deleteSelfUser = async () => {
  return axiosInstance.delete(apiPath("auth/delete"));
};

const getMe = async () => {
  return axiosInstance.get(apiPath("auth/me"));
};

const getProducts = async (options?: {
  authCookie: string;
}): Promise<ProductInfo[]> => {
  const {
    data: { data },
  } = await axiosInstance.get(apiPath("products"), {
    headers: { cookie: options?.authCookie },
  });

  return data;
};

const deleteProduct = async (id: String) => {
  return axiosInstance.delete(apiPath(`products/${id}`));
};

const postProduct = async (data: ProductDataCreate) => {
  return axiosInstance.post(apiPath("products"), data);
};

const editProduct = async ({
  id,
  data,
}: {
  id: string;
  data: ProductDataUpdate;
}) => {
  return axiosInstance.put(apiPath(`products/${id}`), data);
};

const getOrders = async (options?: { authCookie: string }) => {
  const { data } = await axiosInstance.get(apiPath("orders"), {
    headers: { cookie: options?.authCookie },
  });

  return data;
};

const getOrder = async (id: String) => {
  return axiosInstance.get(apiPath(`orders/${id}`));
};

const postOrder = async (data: any) => {
  return axiosInstance.post(apiPath("orders"), data);
};

const getClients = async (options?: { authCookie: string }) => {
  const { data } = await axiosInstance.get(apiPath("clients"), {
    headers: { cookie: options?.authCookie },
  });

  return data;
};

const getDestinations = async (options?: { authCookie: string }) => {
  const { data } = await axiosInstance.get(apiPath("destinations"), {
    headers: { cookie: options?.authCookie },
  });

  return data;
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
  },
  products: {
    getProducts,
    postProduct,
    deleteProduct,
    editProduct,
  },
  orders: {
    getOrders,
    getOrder,
    postOrder,
    getClients,
    getDestinations,
  },
};
