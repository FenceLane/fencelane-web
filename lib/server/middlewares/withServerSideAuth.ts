import { Session, User } from "@prisma/client";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { prismaClient } from "../../prisma/prismaClient";
import {
  getDeleteSessionCookie,
  getSessionCookie,
  getSessionExpirationDate,
  SET_COOKIE_HEADER,
  shouldRefreshSession,
} from "../cookieSessionUtils";

type AuthContextExtend = { session: Session & { user: User } };

const loginPageRedirect = {
  permanent: false,
  destination: "/login",
};

export const withServerSideAuth =
  <C extends GetServerSidePropsContext, P>(
    handler: (
      ctx: C & AuthContextExtend
    ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
  ) =>
  async (ctx: C) => {
    const { req, res } = ctx;

    try {
      const sessionId = req.cookies.authorization;

      if (!sessionId) {
        return {
          redirect: loginPageRedirect,
        };
      }

      const session = await prismaClient.session.findUnique({
        include: {
          user: true,
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

      return await handler(ctx as C & AuthContextExtend);
    } catch {
      return {
        redirect: loginPageRedirect,
      };
    }
  };
