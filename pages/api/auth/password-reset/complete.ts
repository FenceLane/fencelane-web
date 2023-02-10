import { withValidatedJSONRequestBody } from "../../../../lib/server/middlewares/withValidatedJSONRequestBody";
import { prismaClient } from "../../../../lib/prisma/prismaClient";
import {
  BackendError,
  BackendErrorLabel,
  BackendResponseStatusCode,
} from "../../../../lib/server/BackendError/BackendError";
import { withApiMethods } from "../../../../lib/server/middlewares/withApiMethods";
import {
  encryptStringAES,
  encryptStringSHA256,
} from "../../../../lib/server/CryptographyService/CryptographyService";
import { PasswordResetFormPasswordDataSchema } from "../../../../lib/schema/passwordResetFormPasswordData";

export default withApiMethods({
  PUT: withValidatedJSONRequestBody(PasswordResetFormPasswordDataSchema)(
    async (req, res) => {
      const { password: newPassword, token } = req.parsedBody;

      const encryptedToken = encryptStringSHA256(token);

      return await prismaClient.$transaction(async (tx) => {
        const foundToken = await tx.passwordResetToken.findFirst({
          where: { token: encryptedToken },
          include: { user: true },
        });

        //we check if token does exist and is valid (not-expired)
        if (!foundToken) {
          throw new BackendError({
            code: BackendResponseStatusCode.UNAUTHORIZED,
            label: BackendErrorLabel.INVALID_PASSWORD_RESET_TOKEN,
          });
        }

        if (foundToken.expiresAt < new Date()) {
          //when token is expired, we can delete it
          await tx.passwordResetToken.delete({
            where: { id: foundToken.id },
          });

          throw new BackendError({
            code: BackendResponseStatusCode.UNAUTHORIZED,
            label: BackendErrorLabel.INVALID_PASSWORD_RESET_TOKEN,
          });
        }

        //token is valid, we can change the password
        const { user } = foundToken;

        const newEncryptedPassword = encryptStringAES(newPassword);
        await tx.user.update({
          where: { id: user.id },
          data: { password: newEncryptedPassword },
        });

        //after user has updated their password, we can remove all their tokens from the db
        await tx.passwordResetToken.deleteMany({
          where: { userId: user.id },
        });

        return res
          .status(BackendResponseStatusCode.SUCCESS)
          .send({ data: true });
      });
    }
  ),
});
