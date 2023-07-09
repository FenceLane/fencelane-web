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
  },
} as const;
