import { withValidatedJSONRequestBody } from "../../../lib/server/middlewares/withValidatedJSONRequestBody";
import {
  getSessionCookie,
  getSessionExpirationDate,
  SET_COOKIE_HEADER,
} from "../../../lib/server/cookies";
import { prisma } from "../../../lib/prisma/client";
import {
  BackendError,
  BackendErrorLabel,
  sendBackendError,
} from "../../../lib/server/BackendError/BackendError";
import { RegisterFormDataSchema } from "../../../lib/schema/registerFormData";
import { RESPONSE_STATUS_CODE } from "../../../lib/server/responseStatus";
import { encryptPassword } from "../../../lib/server/PasswordCrypto/PasswordCrypto";

export default withValidatedJSONRequestBody(RegisterFormDataSchema)(
  async (req, res) => {
    const { email, password, name } = req.parsedBody;

    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      return sendBackendError(
        res,
        new BackendError({
          code: RESPONSE_STATUS_CODE.CONFLICT,
          label: BackendErrorLabel.USER_ALREADY_EXISTS,
        })
      );
    }

    const encryptedPassword = encryptPassword(password);

    const newUser = await prisma.user.create({
      data: { email, name, password: encryptedPassword },
    });

    //create session
    const sessionExpirationDate = getSessionExpirationDate();

    const newSession = await prisma.session.create({
      data: { expiresAt: sessionExpirationDate, userId: newUser.id },
    });

    //set cookie
    const sessionCookie = getSessionCookie(
      newSession.id,
      sessionExpirationDate
    );

    res.setHeader(SET_COOKIE_HEADER, sessionCookie);

    return res.status(RESPONSE_STATUS_CODE.SUCCESS).send({ data: newUser });
  }
);
