import { prismaClient } from "../../../lib/prisma/prismaClient";
import { BackendResponseStatusCode } from "../../../lib/server/BackendError/BackendError";
import { withApiMethods } from "../../../lib/server/middlewares/withApiMethods";
import {
  encryptStringSHA256,
  getRandomString,
} from "../../../lib/server/CryptographyService/CryptographyService";
import { getRegisterTokenExpirationDate } from "../../../lib/server/utils/cookieSessionUtils";

export default withApiMethods({
  POST: async (_req, res) => {
    return await prismaClient.$transaction(async (tx) => {
      //delete all existing tokens
      await tx.registerToken.deleteMany({});

      //create new token
      const registerToken = getRandomString(64);
      const encryptedToken = encryptStringSHA256(registerToken);

      const token = await tx.registerToken.create({
        data: {
          token: encryptedToken,
          expiresAt: getRegisterTokenExpirationDate(),
        },
      });

      return res
        .status(BackendResponseStatusCode.SUCCESS)
        .send({ data: token });
    });
  },
  DELETE: async (_req, res) => {
    const deleted = await prismaClient.registerToken.deleteMany({});
    return res
      .status(BackendResponseStatusCode.SUCCESS)
      .send({ data: deleted });
  },
  GET: async (_req, res) => {
    const token = await prismaClient.registerToken.findFirst({});
    return res.status(BackendResponseStatusCode.SUCCESS).send({ data: token });
  },
});
