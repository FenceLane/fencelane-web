export interface UserInfo {
  email: string;
  name: string;
  role: number;
  phone: string;
  id: string;
}

export enum USER_ROLE {
  ADMIN = 0,
  USER = 1,
}

export enum COMMODITY_TYPE {
  BLACK = "black",
  WHITE_WET = "white_wet",
  WHITE_DRY = "white_dry",
}

export enum ORDER_STATUS {
  PREPARING = "preparing",
  PACKED = "packed",
  DELIVERY = "delivery",
  FINISHED = "finished",
}
