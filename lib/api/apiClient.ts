import axios from "axios";
import { ClientConfig } from "../AppConfig/ClientConfig";
import {
  CategoryInfo,
  ClientPostInfo,
  CommissionInfo,
  DestinationPostInfo,
  ExpansePostInfo,
  OrderInfo,
  OrderPostInfo,
  OrderProductInfo,
  PRODUCT_VARIANT,
  ProductInfo,
  RegisterTokenInfo,
  TransportPostInfo,
} from "../types";
import { EventInfo, USER_ROLE } from "../types";
import https from "https";
import { ProductDataCreate, ProductDataUpdate } from "../schema/productData";
import { OrderStatusData } from "../schema/orderStatusData";
import { EventDataCreate, EventDataUpdate } from "../schema/eventData";
import { realTimeClient } from "./realtimeClient";
import { QueryKey } from "@tanstack/react-query";

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
  registerToken,
}: {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: USER_ROLE;
  registerToken: string;
}) => {
  return axiosInstance.post(apiPath("auth/register"), {
    name,
    email,
    phone,
    role,
    password,
    registerToken,
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

const getProductsCategories = async (options?: {
  authCookie: string;
}): Promise<CategoryInfo[]> => {
  const {
    data: { data },
  } = await axiosInstance.get(apiPath("products/categories"), {
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

const transferVariant = async ({
  id,
  data,
}: {
  id: string;
  data: { amount: number; variant: PRODUCT_VARIANT };
}) => {
  return axiosInstance.post(apiPath(`products/${id}/variant-transfer`), data);
};

const getOrders = async (options?: {
  authCookie: string;
}): Promise<OrderInfo[]> => {
  const {
    data: { data },
  } = await axiosInstance.get(apiPath("orders"), {
    headers: { cookie: options?.authCookie },
  });

  return data;
};

const getOrdersByParentOrderId = async (options?: {
  authCookie: string;
}): Promise<{ [ParentOrderId: string]: OrderInfo[] }> => {
  const {
    data: { data },
  } = await axiosInstance.get(apiPath(`orders?groupBy=parentOrderId`), {
    headers: { cookie: options?.authCookie },
  });

  return data;
};

const getOrder = async (id: number): Promise<OrderInfo> => {
  const {
    data: { data },
  } = await axiosInstance.get(apiPath(`orders/${id}`));
  return data;
};

const postOrder = async (data: OrderPostInfo) => {
  return axiosInstance.post(apiPath("orders"), data);
};

const getClients = async (options?: { authCookie: string }) => {
  const { data } = await axiosInstance.get(apiPath("clients"), {
    headers: { cookie: options?.authCookie },
  });
  return data;
};

const getEvents = async (options?: {
  authCookie: string;
}): Promise<EventInfo[]> => {
  const {
    data: { data },
  } = await axiosInstance.get(apiPath("events"), {
    headers: { cookie: options?.authCookie },
  });

  return data;
};

const updateStatus = async ({
  data,
  id,
}: {
  id: number;
  data: OrderStatusData;
}) => {
  return axiosInstance.post(apiPath(`orders/${id}/statuses`), data);
};

const getEurRate = async () => {
  const { data } = await axiosInstance.get(
    "https://api.nbp.pl/api/exchangerates/rates/A/EUR/?format=json"
  );
  return data.rates[0];
};

const getOrderTransportCost = async (id: number) => {
  const {
    data: { data },
  } = await axiosInstance.get(apiPath(`orders/${id}/transport-cost`));
  return data;
};
const getOrderExpanses = async (id: number) => {
  const {
    data: { data },
  } = await axiosInstance.get(apiPath(`orders/${id}/expanses`));
  return data;
};

const postOrderTransportCost = async ({ id, data }: TransportPostInfo) => {
  return axiosInstance.post(apiPath(`orders/${id}/transport-cost`), data);
};

const postOrderExpanses = async ({ id, data }: ExpansePostInfo) => {
  return axiosInstance.post(apiPath(`orders/${id}/expanses`), data);
};

const updateOrder = async ({
  id,
  data,
}: {
  id: number;
  data: Partial<OrderInfo>;
}) => {
  return axiosInstance.put(apiPath(`orders/${id}`), data);
};

const updateOrderProducts = async ({
  data,
  id,
}: {
  id: number;
  data: Partial<OrderProductInfo>[];
}) => {
  return axiosInstance.patch(apiPath(`orders/${id}/products`), data);
};

const postOrderFile = async ({ id, data }: { id: number; data: FormData }) => {
  return axiosInstance.post(apiPath(`orders/${id}/files`), data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const deleteOrderFile = async ({ id, key }: { id: number; key: string }) => {
  return axiosInstance.delete(apiPath(`orders/${id}/files/${key}`));
};

const postClient = async ({ data }: ClientPostInfo) => {
  return axiosInstance.post(apiPath(`clients`), data);
};

const postDestination = async ({ id, data }: DestinationPostInfo) => {
  return axiosInstance.post(apiPath(`clients/${id}/destinations`), data);
};

const deleteExpanses = async (id: number) => {
  return axiosInstance.delete(apiPath(`orders/${id}/expanses`));
};

const deleteTransportCost = async (id: number) => {
  return axiosInstance.delete(apiPath(`orders/${id}/transport-cost`));
};

const postEvent = async (data: EventDataCreate) => {
  return axiosInstance.post(apiPath("events"), data);
};

const updateEvent = async ({
  id,
  data,
}: {
  id: string;
  data: EventDataUpdate;
}) => {
  return axiosInstance.put(apiPath(`events/${id}`), data);
};

const deleteEvent = async (id: string) => {
  return axiosInstance.delete(apiPath(`events/${id}`));
};

const getEmployees = async (options?: { authCookie: string }) => {
  const { data } = await axiosInstance.get(apiPath("users"), {
    headers: { cookie: options?.authCookie },
  });
  return data.data;
};

const changeRole = async ({
  id,
  data,
}: {
  id: string;
  data: { role: USER_ROLE };
}) => {
  return axiosInstance.put(apiPath(`users/${id}`), data);
};

const getCommissions = async (options?: {
  authCookie: string;
}): Promise<CommissionInfo[]> => {
  const {
    data: { data },
  } = await axiosInstance.get(apiPath("commissions"), {
    headers: { cookie: options?.authCookie },
  });

  return data;
};

const updateCommissionProducts = async ({
  data,
  id,
}: {
  id: number;
  data: { filledQuantity: number; productCommissionId: string }[];
}) => {
  return axiosInstance.patch(apiPath(`commissions/${id}/products`), data);
};

const postCommission = async (data: {
  products: { productId: string; quantity: number }[];
}) => {
  return axiosInstance.post(apiPath("commissions"), data);
};

const getRegisterToken = async (options?: {
  authCookie: string;
}): Promise<RegisterTokenInfo> => {
  const {
    data: { data },
  } = await axiosInstance.get(apiPath("auth/register-token"), {
    headers: { cookie: options?.authCookie },
  });

  return data;
};

const deleteRegisterToken = async () => {
  return axiosInstance.delete(apiPath("auth/register-token"));
};

const postRegisterToken = async () => {
  return axiosInstance.post(apiPath("auth/register-token"));
};

export const ABLY_QUERY_KEYS_CHANNEL = "queryKeysChannel";
export const ABLY_QUERY_KEYS_EVENT = "queryKeys";

export const apiClient = {
  queryKeys: {
    listen: ({
      onQueryKeyArrived,
      onConnected,
    }: {
      onQueryKeyArrived: (queryKey: QueryKey) => void;
      onConnected: () => void;
    }) =>
      realTimeClient.listen({
        channelName: ABLY_QUERY_KEYS_CHANNEL,
        eventName: ABLY_QUERY_KEYS_EVENT,
        onMessage: onQueryKeyArrived,
        onConnected,
      }),
    close: realTimeClient.close,
    send: (queryKey: QueryKey) =>
      realTimeClient.sendMessage({
        channelName: ABLY_QUERY_KEYS_CHANNEL,
        eventName: ABLY_QUERY_KEYS_EVENT,
        message: queryKey,
      }),
  },
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
    getProductsCategories,
    postProduct,
    deleteProduct,
    editProduct,
    transferVariant,
  },
  orders: {
    getOrders,
    getOrder,
    postOrder,
    getClients,
    updateStatus,
    updateOrder,
    updateOrderProducts,
    postClient,
    postDestination,
    getOrdersByParentOrderId,
    postOrderFile,
    deleteOrderFile,
  },
  calcs: {
    getEurRate,
    getOrderTransportCost,
    getOrderExpanses,
    postOrderTransportCost,
    postOrderExpanses,
    deleteExpanses,
    deleteTransportCost,
  },
  events: {
    getEvents,
    postEvent,
    deleteEvent,
    updateEvent,
  },
  employees: {
    getEmployees,
    changeRole,
  },
  commissions: {
    getCommissions,
    updateCommissionProducts,
    postCommission,
  },
  register_token: {
    getRegisterToken,
    deleteRegisterToken,
    postRegisterToken,
  },
};
