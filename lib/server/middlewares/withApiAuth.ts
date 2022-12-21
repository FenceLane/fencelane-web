import { NextApiRequest, NextApiResponse } from "next";
import type { Session, User } from "@prisma/client";
import {
  BackendErrorLabel,
  BackendResponseStatusCode,
  sendBackendError,
} from "../BackendError/BackendError";
import { prismaClient } from "../../prisma/prismaClient";
import {
  getSessionCookie,
  getSessionExpirationDate,
  SET_COOKIE_HEADER,
  shouldRefreshSession,
} from "../cookieSessionUtils";

type AuthRequestExtend = { session: Session & { user: User } };

const sendUnauthorized = (res: NextApiResponse) => {
  return sendBackendError(res, {
    code: BackendResponseStatusCode.UNAUTHORIZED,
    label: BackendErrorLabel.UNAUTHORIZED,
  });
};

export const withApiAuth =
  <R extends NextApiRequest>(
    handler: (req: R & AuthRequestExtend, res: NextApiResponse) => unknown
  ) =>
  async (req: R, res: NextApiResponse) => {
    const sessionId = req.cookies.authorization;

    if (!sessionId) {
      return sendUnauthorized(res);
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
      return sendUnauthorized(res);
    }

    if (session.expiresAt < new Date()) {
      return sendUnauthorized(res);
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

    (req as R & AuthRequestExtend).session = session;

    return await handler(req as R & AuthRequestExtend, res);
  };
