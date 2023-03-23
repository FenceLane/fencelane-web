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

export interface OrderInfo {
  id: number;
  clientId: string;
  destinationId: string;
  date: Date;
  files: string[];
  createdAt: Date;
  updatedAt: Date;
  client: {
    id: string;
    name: string;
    shortName: string;
    email: string;
    phone: string;
  };
  destination: {
    id: string;
    country: string;
    address: string;
    postalCode: string;
    city: string;
  };
  products: {
    id: string;
    orderId: number;
    productId: string;
    quantity: number;
    price: string;
    createdAt: Date;
    updatedAt: Date;
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
  }[];
  statusHistory: [
    {
      id: string;
      status: ORDER_STATUS;
      date: Date;
      creatorId: string;
      orderId: number;
      creator: {
        name: string;
        role: USER_ROLE;
      };
    }
  ];
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
