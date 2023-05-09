import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { prismaClient } from "../../../../../../lib/prisma/prismaClient";
import { DestinationDataUpdateSchema } from "../../../../../../lib/schema/destinationData";
import {
  BackendErrorLabel,
  BackendResponseStatusCode,
  PrismaErrorCode,
  sendBackendError,
} from "../../../../../../lib/server/BackendError/BackendError";
import { withApiAuth } from "../../../../../../lib/server/middlewares/withApiAuth";
import { withApiMethods } from "../../../../../../lib/server/middlewares/withApiMethods";
import { withValidatedJSONRequestBody } from "../../../../../../lib/server/middlewares/withValidatedJSONRequestBody";

export default withApiMethods({
  GET: withApiAuth(async (req, res) => {
    const { destinationId } = req.query;
    if (typeof destinationId !== "string") {
      throw Error('"destinationId" was not passed in dynamic api path.');
    }

    const destination = await prismaClient.destination.findUnique({
      where: { id: destinationId },
      include: { client: true },
    });

    if (!destination) {
      return sendBackendError(res, {
        code: BackendResponseStatusCode.NOT_FOUND,
        label: BackendErrorLabel.DESTINATION_DOES_NOT_EXIST,
      });
    }

    return res
      .status(BackendResponseStatusCode.SUCCESS)
      .send({ data: destination });
  }),

  PUT: withApiAuth(
    withValidatedJSONRequestBody(DestinationDataUpdateSchema)(
      async (req, res) => {
        const { destinationId } = req.query;
        if (typeof destinationId !== "string") {
          throw Error('"destinationId" was not passed in dynamic api path.');
        }

        const destinationData = req.parsedBody;

        try {
          const updatedDestination = await prismaClient.destination.update({
            where: { id: destinationId },
            data: destinationData,
            include: { client: true },
          });

          return res
            .status(BackendResponseStatusCode.SUCCESS)
            .send({ data: updatedDestination });
        } catch (error) {
          if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === PrismaErrorCode.RECORD_NOT_FOUND_OR_RESTRICTED) {
              return sendBackendError(res, {
                code: BackendResponseStatusCode.NOT_FOUND,
                label: BackendErrorLabel.DESTINATION_DOES_NOT_EXIST,
                message: error.message,
              });
            }
          }
          throw error;
        }
      }
    )
  ),

  DELETE: withApiAuth(async (req, res) => {
    const { destinationId } = req.query;
    if (typeof destinationId !== "string") {
      throw Error('"destinationId" was not passed in dynamic api path.');
    }

    try {
      const deletedDestination = await prismaClient.destination.delete({
        where: { id: destinationId },
      });

      return res
        .status(BackendResponseStatusCode.SUCCESS)
        .send({ data: deletedDestination });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCode.RECORD_NOT_FOUND_OR_RESTRICTED) {
          return sendBackendError(res, {
            code: BackendResponseStatusCode.NOT_FOUND,
            label: BackendErrorLabel.DESTINATION_DOES_NOT_EXIST,
            message: error.message,
          });
        }
      }
      throw error;
    }
  }),
});
