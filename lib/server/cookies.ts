export const SET_COOKIE_HEADER = "Set-Cookie";

const EXPIRE_SESSION_AFTER = 1000 * 60 * 60 * 24 * 4; //4 days in ms

export const getSessionExpirationDate = () => {
  return new Date(Date.now() + EXPIRE_SESSION_AFTER);
};

export const getSessionCookie = (sessionId: string, expireAt: Date) =>
  `authorization=${sessionId}; Expires=${expireAt.toUTCString()}; Secure; HttpOnly; Path=/;`;

export const getDeleteSessionCookie = () =>
  `authorization=; Expires=${new Date(Date.now()).toUTCString()}; Path=/;`;
