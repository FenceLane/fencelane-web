const EXPIRE_TOKEN_AFTER = 1000 * 60 * 5; // 5 minutes in ms

export const getResetPasswordTokenExpirationDate = () => {
  return new Date(Date.now() + EXPIRE_TOKEN_AFTER);
};
