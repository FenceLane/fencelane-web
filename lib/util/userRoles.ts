import { USER_ROLE } from "../types";

const isRoleAllowed = (userRoles: USER_ROLE[]) => {
  return (userRole: USER_ROLE) => userRoles.includes(userRole);
};

export const userFeatures = {
  storage: {
    isManageProductButtonAllowed: isRoleAllowed([
      USER_ROLE.ADMIN,
      USER_ROLE.BOSS,
      USER_ROLE.VICE_BOSS,
    ]),
    isAddNewProductButtonAllowed: isRoleAllowed([
      USER_ROLE.ADMIN,
      USER_ROLE.BOSS,
      USER_ROLE.VICE_BOSS,
      USER_ROLE.MARKETER,
    ]),
  },
  loads: {
    isProfitAllowed: isRoleAllowed([
      USER_ROLE.ADMIN,
      USER_ROLE.BOSS,
      USER_ROLE.VICE_BOSS,
    ]),
    isCalculationButtonAllowed: isRoleAllowed([
      USER_ROLE.ADMIN,
      USER_ROLE.BOSS,
      USER_ROLE.VICE_BOSS,
    ]),
    isEditProductsButtonAllowed: isRoleAllowed([
      USER_ROLE.ADMIN,
      USER_ROLE.BOSS,
      USER_ROLE.VICE_BOSS,
      USER_ROLE.MARKETER,
    ]),
  },
  menu: {
    stats: isRoleAllowed([
      USER_ROLE.ADMIN,
      USER_ROLE.BOSS,
      USER_ROLE.VICE_BOSS,
    ]),
    storage: isRoleAllowed([
      USER_ROLE.ADMIN,
      USER_ROLE.BOSS,
      USER_ROLE.VICE_BOSS,
      USER_ROLE.MARKETER,
      USER_ROLE.SATURATOR,
    ]),
    loads: isRoleAllowed([
      USER_ROLE.ADMIN,
      USER_ROLE.BOSS,
      USER_ROLE.VICE_BOSS,
      USER_ROLE.MARKETER,
      USER_ROLE.SATURATOR,
    ]),
    orders: isRoleAllowed([
      USER_ROLE.ADMIN,
      USER_ROLE.BOSS,
      USER_ROLE.VICE_BOSS,
      USER_ROLE.MARKETER,
    ]),
    commissions: isRoleAllowed([
      USER_ROLE.ADMIN,
      USER_ROLE.BOSS,
      USER_ROLE.VICE_BOSS,
      USER_ROLE.MARKETER,
    ]),
    schedule: isRoleAllowed([
      USER_ROLE.ADMIN,
      USER_ROLE.BOSS,
      USER_ROLE.VICE_BOSS,
      USER_ROLE.MARKETER,
      USER_ROLE.SATURATOR,
    ]),
    calculations: isRoleAllowed([
      USER_ROLE.ADMIN,
      USER_ROLE.BOSS,
      USER_ROLE.VICE_BOSS,
    ]),
    employees: isRoleAllowed([
      USER_ROLE.ADMIN,
      USER_ROLE.BOSS,
      USER_ROLE.VICE_BOSS,
    ]),
    admin: isRoleAllowed([
      USER_ROLE.ADMIN,
      USER_ROLE.BOSS,
      USER_ROLE.VICE_BOSS,
    ]),
  },
} as const;

export const getRoleByNumber = (role: USER_ROLE) => {
  switch (role) {
    case 0:
      return "admin";
      break;
    case 1:
      return "user";
      break;
    case 2:
      return "boss";
      break;
    case 3:
      return "vice_boss";
      break;
    case 4:
      return "saturator";
      break;
    case 5:
      return "marketer";
      break;
    default:
      return "other";
      break;
  }
};
