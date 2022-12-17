import { NextApiRequest, NextApiResponse } from "next";
import type { Session, User } from "@prisma/client";
import {
  BackendErrorLabel,
  BackendResponseStatusCode,
  sendBackendError,
} from "../BackendError/BackendError";
import { prisma } from "../../prisma/client";
import {
  getSessionCookie,
  getSessionExpirationDate,
  shouldRefreshSession,
} from "../cookieSessionUtils";

type AuthRequestExtend = { session: Session & { user: User } };

const sendUnauthorised = (res: NextApiResponse) => {
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
      return sendUnauthorised(res);
    }

    const session = await prisma.session.findUnique({
      include: {
        user: true,
      },
      where: {
        id: sessionId,
      },
    });

    if (!session) {
      return sendUnauthorised(res);
    }

    if (session.expiresAt < new Date()) {
      return sendUnauthorised(res);
    }

    if (shouldRefreshSession(session.updatedAt)) {
      const sessionExpirationDate = getSessionExpirationDate();

      await prisma.session.update({
        where: {
          id: sessionId,
        },
        data: {
          expiresAt: sessionExpirationDate,
        },
      });
      res.setHeader(
        "Set-Cookie",
        getSessionCookie({ sessionId, expireAt: sessionExpirationDate })
      );
    }

    (req as R & AuthRequestExtend).session = session;

    return await handler(req as R & AuthRequestExtend, res);
  };
