import { prisma } from "../../../../lib/prisma/client";
import {
  BackendErrorLabel,
  BackendResponseStatusCode,
  sendBackendError,
} from "../../../../lib/server/BackendError/BackendError";
import { renewCookieSession } from "../../../../lib/server/cookies";
import { withApiMethods } from "../../../../lib/server/middlewares/withApiMethods";

export default withApiMethods({
  PUT: async (req, res) => {
    const sessionId = req.cookies.authorization;

    if (!sessionId) {
      return sendBackendError(res, {
        code: BackendResponseStatusCode.UNAUTHORIZED,
        label: BackendErrorLabel.UNAUTHORIZED,
      });
    }

    await renewCookieSession(res, { sessionId });

    return res.status(BackendResponseStatusCode.SUCCESS).send({ data: true });
  },
});
