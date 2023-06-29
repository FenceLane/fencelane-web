import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { prismaClient } from "../../../../lib/prisma/prismaClient";
import {
  BackendErrorLabel,
  BackendResponseStatusCode,
  PrismaErrorCode,
  sendBackendError,
} from "../../../../lib/server/BackendError/BackendError";
import { withApiAuth } from "../../../../lib/server/middlewares/withApiAuth";
import { withApiMethods } from "../../../../lib/server/middlewares/withApiMethods";
import { withValidatedJSONRequestBody } from "../../../../lib/server/middlewares/withValidatedJSONRequestBody";
import { UserDataUpdateSchema } from "../../../../lib/schema/userData";
import { User } from "@prisma/client";
import { USER_ROLE } from "../../../../lib/types";

export default withApiMethods({
  GET: withApiAuth(async (req, res) => {
    const { userId } = req.query;

    if (typeof userId !== "string") {
      throw Error('"userId" was not passed in dynamic api path.');
    }

    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true, phone: true },
    });

    if (!user) {
      return sendBackendError(res, {
        code: BackendResponseStatusCode.NOT_FOUND,
        label: BackendErrorLabel.USER_DOES_NOT_EXIST,
      });
    }

    return res.status(BackendResponseStatusCode.SUCCESS).send({ data: user });
  }),

  PUT: withApiAuth(
    withValidatedJSONRequestBody(UserDataUpdateSchema)(async (req, res) => {
      //FIXME: improve types for req.session.user
      const selfUser = (req as typeof req & { session: { user: User } }).session
        .user;

      const { userId } = req.query;
      if (typeof userId !== "string") {
        throw Error('"userId" was not passed in dynamic api path.');
      }

      //only admin can update other users (including their role)
      if (selfUser.role !== USER_ROLE.ADMIN) {
        return sendBackendError(res, {
          code: BackendResponseStatusCode.FORBIDDEN,
          label: BackendErrorLabel.FORBIDDEN_ADMIN_ONLY,
        });
      }

      const userData = req.parsedBody;

      try {
        const updatedUser = await prismaClient.user.update({
          where: { id: userId },
          data: userData,
        });

        return res
          .status(BackendResponseStatusCode.SUCCESS)
          .send({ data: updatedUser });
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === PrismaErrorCode.RECORD_NOT_FOUND_OR_RESTRICTED) {
            return sendBackendError(res, {
              code: BackendResponseStatusCode.NOT_FOUND,
              label: BackendErrorLabel.USER_DOES_NOT_EXIST,
              message: error.message,
            });
          }
        }
        throw error;
      }
    })
  ),
});
