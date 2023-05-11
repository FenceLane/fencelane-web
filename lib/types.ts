export interface UserInfo {
  email: string;
  name: string;
  role: number;
  phone: string;
  id: string;
}

export interface ProductInfo {
  id: string;
  dimensions: string;
  variant: PRODUCT_VARIANT;
  itemsPerPackage: number;
  volumePerPackage: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
  category: CategoryInfo;
}

export interface CategoryInfo {
  id: string;
  name: string;
  color: string;
}

export interface OrderProductInfo {
  productOrderId: string;
  id: string;
  orderId: number;
  productId: string;
  quantity: number;
  price: string;
  createdAt: Date;
  updatedAt: Date;
  currency: CURRENCY;
  product: {
    id: string;
    dimensions: string;
    variant: string;
    itemsPerPackage: number;
    volumePerPackage: string;
    categoryId: string;
    stock: number;
    createdAt: Date;
    updatedAt: Date;
    category: {
      id: string;
      name: string;
      color: string;
    };
  };
}

export interface OrderInfo {
  id: number;
  destinationId: string;
  date: Date;
  creatorId: string;
  profit: number | null;
  createdAt: Date;
  updatedAt: Date;
  files: string[];
  destination: {
    id: string;
    country: string;
    address: string;
    postalCode: string;
    city: string;
    clientId: string;
    client: {
      id: string;
      name: string;
      shortName: string;
      email: string;
      phone: string;
    };
  };
  products: OrderProductInfo[];
  statusHistory: {
    id: string;
    status: ORDER_STATUS;
    date: Date;
    creatorId: string;
    orderId: number;
    creator: {
      name: string;
      role: USER_ROLE;
    };
  }[];
}

export interface TransportInfo {
  id: string;
  price: string;
  currency: string;
  orderId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExpansesInfo {
  [productOrderId: string]: {
    id: string;
    price: string;
    currency: CURRENCY;
    type: PRODUCT_EXPANSE;
    productOrderId: string;
  }[];
}

export interface InitialCosts {
  commodity: InitialCost;
  saturation: InitialCost;
  marketer: InitialCost;
  other: InitialCost;
}
[];

export interface InitialCost {
  price: number;
  currency: CURRENCY;
  costType: PRODUCT_EXPANSE;
  quantityType: QUANTITY_TYPE;
}

export interface ExpansePostInfo {
  id: number;
  data: {
    price: string;
    currency: CURRENCY;
    productOrderId: string;
    type: PRODUCT_EXPANSE;
  }[];
}

export interface TransportPostInfo {
  id: number;
  data: { price: string; currency: CURRENCY };
}

export interface ClientPostInfo {
  data: { name: string; shortName: string; email: string; phone: string };
}

export interface DestinationPostInfo {
  id: string;
  data: { country: string; address: string; postalCode: string; city: string };
}

export enum USER_ROLE {
  ADMIN = 0,
  USER = 1,
}

export enum PRODUCT_VARIANT {
  BLACK = "black",
  WHITE_WET = "white_wet",
  WHITE_DRY = "white_dry",
}

export enum ORDER_STATUS {
  ORDER_CREATED = "order created",
  RECEIVED_IN_STORAGE = "received in storage",
  DRIED = "dried",
  IMPREGNATED = "impregnated",
  SENT = "sent",
  DELIVERED = "delivered",
}

export enum PRODUCT_EXPANSE {
  COMMODITY = "commodity",
  SATURATION = "saturation",
  WOOD_FINISHING = "wood_finishing",
  MARKETER = "marketer",
  OTHER = "other",
}

export enum CONTENT_TYPE {
  APPLICATION_JSON = "application/json",
  MULTIPART_FORM_DATA = "multipart/form-data",
}

export enum CURRENCY {
  EUR = "EUR",
  PLN = "PLN",
}

export enum QUANTITY_TYPE {
  PACKAGES = "packages",
  M3 = "m3",
  PIECES = "pieces",
}
