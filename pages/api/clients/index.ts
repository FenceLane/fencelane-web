import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { prismaClient } from "../../../lib/prisma/prismaClient";
import { ClientDataCreateSchema } from "../../../lib/schema/clientData";
import {
  BackendErrorLabel,
  BackendResponseStatusCode,
  PrismaErrorCode,
  sendBackendError,
} from "../../../lib/server/BackendError/BackendError";
import { withApiAuth } from "../../../lib/server/middlewares/withApiAuth";
import { withApiMethods } from "../../../lib/server/middlewares/withApiMethods";
import { withValidatedJSONRequestBody } from "../../../lib/server/middlewares/withValidatedJSONRequestBody";

export default withApiMethods({
  POST: withApiAuth(
    withValidatedJSONRequestBody(ClientDataCreateSchema)(async (req, res) => {
      const newClientData = req.parsedBody;

      try {
        const createdClient = await prismaClient.client.create({
          data: newClientData,
        });

        return res
          .status(BackendResponseStatusCode.SUCCESS)
          .send({ data: createdClient });
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === PrismaErrorCode.UNIQUE_CONSTRAINT_FAILED) {
            return sendBackendError(res, {
              code: BackendResponseStatusCode.CONFLICT,
              label: BackendErrorLabel.CLIENT_ALREADY_EXISTS,
              message: error.message,
            });
          }
        }
        throw error;
      }
    })
  ),

  GET: withApiAuth(async (_req, res) => {
    const clients = await prismaClient.client.findMany({});

    return res
      .status(BackendResponseStatusCode.SUCCESS)
      .send({ data: clients });
  }),
});
