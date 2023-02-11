import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { prismaClient } from "../../../lib/prisma/prismaClient";
import { DestinationDataCreateSchema } from "../../../lib/schema/destinationData";
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
    withValidatedJSONRequestBody(DestinationDataCreateSchema)(
      async (req, res) => {
        const newDestinationData = req.parsedBody;

        try {
          const createdDestination = await prismaClient.destination.create({
            data: newDestinationData,
          });

          return res
            .status(BackendResponseStatusCode.SUCCESS)
            .send({ data: createdDestination });
        } catch (error) {
          if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === PrismaErrorCode.UNIQUE_CONSTRAINT_FAILED) {
              return sendBackendError(res, {
                code: BackendResponseStatusCode.CONFLICT,
                label: BackendErrorLabel.DESTINATION_ALREADY_EXISTS,
                message: error.message,
              });
            }
          }
          throw error;
        }
      }
    )
  ),

  GET: withApiAuth(async (_req, res) => {
    const destinations = await prismaClient.destination.findMany({});

    return res
      .status(BackendResponseStatusCode.SUCCESS)
      .send({ data: destinations });
  }),
});
