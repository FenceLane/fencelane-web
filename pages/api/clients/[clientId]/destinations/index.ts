import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { prismaClient } from "../../../../../lib/prisma/prismaClient";
import { DestinationDataCreateSchema } from "../../../../../lib/schema/destinationData";
import {
  BackendErrorLabel,
  BackendResponseStatusCode,
  PrismaErrorCode,
  sendBackendError,
} from "../../../../../lib/server/BackendError/BackendError";
import { withApiAuth } from "../../../../../lib/server/middlewares/withApiAuth";
import { withApiMethods } from "../../../../../lib/server/middlewares/withApiMethods";
import { withValidatedJSONRequestBody } from "../../../../../lib/server/middlewares/withValidatedJSONRequestBody";

export default withApiMethods({
  POST: withApiAuth(
    withValidatedJSONRequestBody(DestinationDataCreateSchema)(
      async (req, res) => {
        const { clientId } = req.query;
        if (typeof clientId !== "string") {
          throw Error('"clientId" was not passed in dynamic api path.');
        }

        const newDestinationData = req.parsedBody;

        try {
          const createdDestination = await prismaClient.destination.create({
            data: {
              ...newDestinationData,
              clientId,
            },
            include: { client: true },
          });

          return res
            .status(BackendResponseStatusCode.SUCCESS)
            .send({ data: createdDestination });
        } catch (error) {
          if (error instanceof PrismaClientKnownRequestError) {
            switch (error.code) {
              case PrismaErrorCode.UNIQUE_CONSTRAINT_FAILED:
                return sendBackendError(res, {
                  code: BackendResponseStatusCode.CONFLICT,
                  label: BackendErrorLabel.DESTINATION_ALREADY_EXISTS,
                  message: error.message,
                });

              case PrismaErrorCode.FOREIGN_KEY_NOT_FOUND:
                return sendBackendError(res, {
                  code: BackendResponseStatusCode.CONFLICT,
                  label: BackendErrorLabel.CLIENT_DOES_NOT_EXIST,
                  message: error.message,
                });
            }
          }
          throw error;
        }
      }
    )
  ),

  GET: withApiAuth(async (req, res) => {
    const { clientId } = req.query;
    if (typeof clientId !== "string") {
      throw Error('"clientId" was not passed in dynamic api path.');
    }

    const destinations = await prismaClient.destination.findMany({
      where: { clientId },
      include: { client: true },
    });

    return res
      .status(BackendResponseStatusCode.SUCCESS)
      .send({ data: destinations });
  }),
});
