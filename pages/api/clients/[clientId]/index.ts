import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { prismaClient } from "../../../../lib/prisma/prismaClient";
import { ClientDataUpdateSchema } from "../../../../lib/schema/clientData";
import {
  BackendErrorLabel,
  BackendResponseStatusCode,
  PrismaErrorCode,
  sendBackendError,
} from "../../../../lib/server/BackendError/BackendError";
import { withApiAuth } from "../../../../lib/server/middlewares/withApiAuth";
import { withApiMethods } from "../../../../lib/server/middlewares/withApiMethods";
import { withValidatedJSONRequestBody } from "../../../../lib/server/middlewares/withValidatedJSONRequestBody";

export default withApiMethods({
  GET: withApiAuth(async (req, res) => {
    const { clientId } = req.query;
    if (typeof clientId !== "string") {
      throw Error('"clientId" was not passed in dynamic api path.');
    }

    const client = await prismaClient.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      return sendBackendError(res, {
        code: BackendResponseStatusCode.NOT_FOUND,
        label: BackendErrorLabel.CLIENT_DOES_NOT_EXIST,
      });
    }

    return res.status(BackendResponseStatusCode.SUCCESS).send({ data: client });
  }),

  PUT: withApiAuth(
    withValidatedJSONRequestBody(ClientDataUpdateSchema)(async (req, res) => {
      const { clientId } = req.query;
      if (typeof clientId !== "string") {
        throw Error('"clientId" was not passed in dynamic api path.');
      }

      const clientData = req.parsedBody;

      try {
        const updatedClient = await prismaClient.client.update({
          where: { id: clientId },
          data: clientData,
        });

        return res
          .status(BackendResponseStatusCode.SUCCESS)
          .send({ data: updatedClient });
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === PrismaErrorCode.RECORD_NOT_FOUND_OR_RESTRICTED) {
            return sendBackendError(res, {
              code: BackendResponseStatusCode.NOT_FOUND,
              label: BackendErrorLabel.CLIENT_DOES_NOT_EXIST,
              message: error.message,
            });
          }
        }
        throw error;
      }
    })
  ),

  DELETE: withApiAuth(async (req, res) => {
    const { clientId } = req.query;
    if (typeof clientId !== "string") {
      throw Error('"clientId" was not passed in dynamic api path.');
    }

    try {
      const deletedClient = await prismaClient.client.delete({
        where: { id: clientId },
      });

      return res
        .status(BackendResponseStatusCode.SUCCESS)
        .send({ data: deletedClient });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCode.RECORD_NOT_FOUND_OR_RESTRICTED) {
          return sendBackendError(res, {
            code: BackendResponseStatusCode.NOT_FOUND,
            label: BackendErrorLabel.CLIENT_DOES_NOT_EXIST,
            message: error.message,
          });
        }
      }
      throw error;
    }
  }),
});
