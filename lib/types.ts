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
  variant: string;
  itemsPerPackage: number;
  volumePerPackage: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface StringedProductInfo {
  id: string;
  name: string;
  dimensions: string;
  variant: string;
  itemsPerPackage: string;
  volumePerPackage: string;
  stock: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface ShortStringedProduct {
  id?: string;
  name: string;
  dimensions: string;
  variant: string;
  itemsPerPackage: string;
  volumePerPackage: string;
  stock: string;
}
export interface ShortProduct {
  id?: string;
  name: string;
  dimensions: string;
  variant: string;
  itemsPerPackage: number;
  volumePerPackage: number;
  stock: number;
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
