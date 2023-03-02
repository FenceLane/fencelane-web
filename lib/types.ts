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
    client: {
      email: string;
      id: string;
      name: string;
      phone: string;
      shortName: string;
    };
    destination: {
      address: string;
      city: string;
      country: string;
      id: string;
      postalCode: string;
    };
    products: [
      {
        createdAt: Date;
        id: string;
        orderId: number;
        price: string;
        productId: string;
        quantity: number;
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
