import { Session } from "@prisma/client";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { prismaClient } from "../../prisma/prismaClient";
import { USER_ROLE, UserInfo } from "../../types";
import {
  getDeleteSessionCookie,
  getSessionCookie,
  getSessionExpirationDate,
  SET_COOKIE_HEADER,
  shouldRefreshSession,
} from "../utils/cookieSessionUtils";

type AuthContextExtend = { session: Session & { user: UserInfo } };

const loginPageRedirect = {
  permanent: false,
  destination: "/login",
};

const defaultRedirect = {
  permanent: false,
  destination: "/",
};

export const withServerSideAuth =
  (allowedRoles?: USER_ROLE[]) =>
  <C extends GetServerSidePropsContext, P>(
    handler: (
      ctx: C & AuthContextExtend
    ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
  ) =>
  async (ctx: C) => {
    const { req, res } = ctx;

    try {
      const sessionId = req.cookies.authorization;

      console.log("patryk index page, session:", sessionId);
      if (!sessionId) {
        return {
          redirect: loginPageRedirect,
        };
      }

      const session = await prismaClient.session.findUnique({
        include: {
          user: {
            select: {
              email: true,
              name: true,
              phone: true,
              role: true,
              id: true,
            },
          },
        },
        where: {
          id: sessionId,
        },
      });

      if (!session) {
        res.setHeader(SET_COOKIE_HEADER, getDeleteSessionCookie());
        return {
          redirect: loginPageRedirect,
        };
      }

      if (shouldRefreshSession(session.updatedAt)) {
        const sessionExpirationDate = getSessionExpirationDate();

        await prismaClient.session.update({
          where: {
            id: sessionId,
          },
          data: {
            expiresAt: sessionExpirationDate,
          },
        });

        res.setHeader(
          SET_COOKIE_HEADER,
          getSessionCookie({ sessionId, expireAt: sessionExpirationDate })
        );
      }

      (ctx as C & AuthContextExtend).session = session;

      if (allowedRoles && !allowedRoles.includes(session.user.role)) {
        return {
          redirect: defaultRedirect,
        };
      }

      return await handler(ctx as C & AuthContextExtend);
    } catch {
      return {
        redirect: loginPageRedirect,
      };
    }
  };
