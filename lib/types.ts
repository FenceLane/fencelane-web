export interface UserInfo {
  email: string;
  name: string;
  role: number;
  phone: string;
  id: string;
}

export interface ProductInfo {
  id: string;
  name: string;
  dimensions: string;
  variant: PRODUCT_VARIANT;
  itemsPerPackage: number;
  volumePerPackage: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderInfo {
  data: {
    id: number;
    clientId: string;
    destinationId: string;
    date: Date;
    status: ORDER_STATUS;
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
    products: [
      {
        id: string;
        orderId: number;
        productId: string;
        quantity: number;
        price: string;
        createdAt: Date;
        updatedAt: Date;
      }
    ];
  };
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
  CREATED = "created",
  PREPARING = "preparing",
  PACKED = "packed",
  DELIVERY = "delivery",
  FINISHED = "finished",
}
