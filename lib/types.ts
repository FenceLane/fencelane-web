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
