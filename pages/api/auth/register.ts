import { withValidatedJSONRequestBody } from "../../../lib/server/middlewares/withValidatedJSONRequestBody";
import { createCookieSession } from "../../../lib/server/utils/cookieSessionUtils";
import { prismaClient } from "../../../lib/prisma/prismaClient";
import {
  BackendErrorLabel,
  BackendResponseStatusCode,
  sendBackendError,
} from "../../../lib/server/BackendError/BackendError";
import { RegisterFormDataSchema } from "../../../lib/schema/registerFormData";
import { encryptStringAES } from "../../../lib/server/CryptographyService/CryptographyService";
import { withApiMethods } from "../../../lib/server/middlewares/withApiMethods";

export default withApiMethods({
  POST: withValidatedJSONRequestBody(RegisterFormDataSchema)(
    async (req, res) => {
      const { email, password, name, phone, role, registerToken } =
        req.parsedBody;

      const foundRegisterToken = await prismaClient.registerToken.findFirst({
        where: { token: registerToken },
      });

      //if token does not exist - throw
      if (!foundRegisterToken) {
        return sendBackendError(res, {
          code: BackendResponseStatusCode.UNAUTHORIZED,
          label: BackendErrorLabel.INVALID_REGISTER_TOKEN,
        });
      }

      //if token exists but is expired, throw and delete token
      if (foundRegisterToken.expiresAt < new Date()) {
        await prismaClient.registerToken.deleteMany();
        return sendBackendError(res, {
          code: BackendResponseStatusCode.UNAUTHORIZED,
          label: BackendErrorLabel.INVALID_REGISTER_TOKEN,
        });
      }

      const existingUser = await prismaClient.user.findFirst({
        where: { email },
      });

      if (existingUser) {
        return sendBackendError(res, {
          code: BackendResponseStatusCode.CONFLICT,
          label: BackendErrorLabel.USER_ALREADY_EXISTS,
        });
      }

      const encryptedPassword = encryptStringAES(password);

      const newUser = await prismaClient.user.create({
        data: { email, name, phone, role, password: encryptedPassword },
      });

      await createCookieSession(res, { user: newUser });

      const { password: _, ...userResponse } = newUser;

      return res
        .status(BackendResponseStatusCode.SUCCESS)
        .send({ data: userResponse });
    }
  ),
});
