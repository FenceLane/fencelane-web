import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../prisma/client";

export const SET_COOKIE_HEADER = "Set-Cookie";

const EXPIRE_SESSION_AFTER = 1000 * 60 * 60 * 24 * 4; //4 days in ms

export const getSessionExpirationDate = () => {
  return new Date(Date.now() + EXPIRE_SESSION_AFTER);
};

export const getSessionCookie = (sessionId: string, expireAt: Date) =>
  `authorization=${sessionId}; Expires=${expireAt.toUTCString()}; Secure; HttpOnly; Path=/;`;

export const getDeleteSessionCookie = () =>
  `authorization=; Expires=${new Date(Date.now()).toUTCString()}; Path=/;`;

export const createCookieSession = async (res: NextApiResponse, user: User) => {
  //create session
  const sessionExpirationDate = getSessionExpirationDate();

  const newSession = await prisma.session.create({
    data: { expiresAt: sessionExpirationDate, userId: user.id },
  });

  //set cookie
  const sessionCookie = getSessionCookie(newSession.id, sessionExpirationDate);

  res.setHeader(SET_COOKIE_HEADER, sessionCookie);

  return sessionCookie;
};

export const deleteCookieSession = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  //delete cookie
  res.setHeader("Set-Cookie", getDeleteSessionCookie());

  //delete session
  await prisma.session.delete({
    where: { id: req.cookies.authorization },
  });

  return true;
};
