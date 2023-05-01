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

export enum PRODUCT_EXPANSE {
  COMMODITY = "commodity", //towar
  SATURATION = "saturation", //nasycanie
  WOOD_FINISHING = "wood_finishing", //impregnacja
  MARKETER = "marketer", //handlowiec
  OTHER = "other", //inne
}

export enum CONTENT_TYPE {
  APPLICATION_JSON = "application/json",
  MULTIPART_FORM_DATA = "multipart/form-data",
}
