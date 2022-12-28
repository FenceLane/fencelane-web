import { withValidatedJSONRequestBody } from "../../../../lib/server/middlewares/withValidatedJSONRequestBody";
import { prismaClient } from "../../../../lib/prisma/prismaClient";
import {
  BackendErrorLabel,
  BackendResponseStatusCode,
  sendBackendError,
} from "../../../../lib/server/BackendError/BackendError";
import { withApiMethods } from "../../../../lib/server/middlewares/withApiMethods";
import { PasswordResetFormEmailDataSchema } from "../../../../lib/schema/passwordResetFormEmailData";
import { ClientConfig } from "../../../../lib/AppConfig/ClientConfig";
import {
  encryptStringSHA256,
  getRandomString,
} from "../../../../lib/server/CryptographyService/CryptographyService";
import { getResetPasswordTokenExpirationDate } from "../../../../lib/server/utils/passwordResetUtils";

export default withApiMethods({
  POST: withValidatedJSONRequestBody(PasswordResetFormEmailDataSchema)(
    async (req, res) => {
      const { email } = req.parsedBody;

      const existingUser = await prismaClient.user.findFirst({
        where: { email },
      });

      if (!existingUser) {
        return sendBackendError(res, {
          code: BackendResponseStatusCode.NOT_FOUND,
          label: BackendErrorLabel.USER_DOES_NOT_EXISTS,
        });
      }

      //user with given emai exists, we can send email with message
      const resetPasswordToken = getRandomString(64);
      const encryptedToken = encryptStringSHA256(resetPasswordToken);

      const tokenExpirationDate = getResetPasswordTokenExpirationDate();

      await prismaClient.passwordResetToken.create({
        data: {
          token: encryptedToken,
          expiresAt: tokenExpirationDate,
          userId: existingUser.id,
        },
      });

      const resetPasswordLink = `${ClientConfig.ENV.NEXT_PUBLIC_BASE_URL}/password-reset?token=${resetPasswordToken}`;

      console.log(resetPasswordLink);

      return res
        .status(BackendResponseStatusCode.SUCCESS)
        .send({ data: resetPasswordLink });
    }
  ),
});
