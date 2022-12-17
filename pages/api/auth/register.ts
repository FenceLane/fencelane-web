import { withValidatedJSONRequestBody } from "../../../lib/server/middlewares/withValidatedJSONRequestBody";
import { createCookieSession } from "../../../lib/server/cookies";
import { prisma } from "../../../lib/prisma/client";
import {
  BackendErrorLabel,
  BackendResponseStatusCode,
  sendBackendError,
} from "../../../lib/server/BackendError/BackendError";
import { RegisterFormDataSchema } from "../../../lib/schema/registerFormData";
import { encryptPassword } from "../../../lib/server/PasswordCrypto/PasswordCrypto";
import { withApiMethods } from "../../../lib/server/middlewares/withApiMethods";

export default withApiMethods({
  POST: withValidatedJSONRequestBody(RegisterFormDataSchema)(
    async (req, res) => {
      const { email, password, name } = req.parsedBody;

      const existingUser = await prisma.user.findFirst({
        where: { email },
      });

      if (existingUser) {
        return sendBackendError(res, {
          code: BackendResponseStatusCode.CONFLICT,
          label: BackendErrorLabel.USER_ALREADY_EXISTS,
        });
      }

      const encryptedPassword = encryptPassword(password);

      const newUser = await prisma.user.create({
        data: { email, name, password: encryptedPassword },
      });

      await createCookieSession(res, { user: newUser });

      const { password: _, ...userResponse } = newUser;

      return res
        .status(BackendResponseStatusCode.SUCCESS)
        .send({ data: userResponse });
    }
  ),
});
