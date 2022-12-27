import { withValidatedJSONRequestBody } from "../../../lib/server/middlewares/withValidatedJSONRequestBody";
import { createCookieSession } from "../../../lib/server/cookieSessionUtils";
import { prismaClient } from "../../../lib/prisma/prismaClient";
import {
  BackendErrorLabel,
  BackendResponseStatusCode,
  sendBackendError,
} from "../../../lib/server/BackendError/BackendError";
import { decryptPassword } from "../../../lib/server/PasswordCrypto/PasswordCrypto";
import { withApiMethods } from "../../../lib/server/middlewares/withApiMethods";
import { LoginFormDataSchema } from "../../../lib/schema/loginFormData";

export default withApiMethods({
  POST: withValidatedJSONRequestBody(LoginFormDataSchema)(async (req, res) => {
    const { email, password } = req.parsedBody;

    const existingUser = await prismaClient.user.findFirst({
      where: { email },
    });

    if (!existingUser) {
      return sendBackendError(res, {
        code: BackendResponseStatusCode.UNAUTHORIZED,
        label: BackendErrorLabel.INVALID_CREDENTIALS,
      });
    }

    const doesPasswordMatch =
      password === decryptPassword(existingUser.password);

    if (!doesPasswordMatch) {
      return sendBackendError(res, {
        code: BackendResponseStatusCode.UNAUTHORIZED,
        label: BackendErrorLabel.INVALID_CREDENTIALS,
      });
    }

    await createCookieSession(res, { user: existingUser });

    const { password: _, ...userResponse } = existingUser;

    return res
      .status(BackendResponseStatusCode.SUCCESS)
      .send({ data: userResponse });
  }),
});
