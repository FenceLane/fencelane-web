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
import { EventDataUpdateSchema } from "../../../../lib/schema/eventData";

export default withApiMethods({
  GET: withApiAuth(async (req, res) => {
    const { eventId } = req.query;

    if (typeof eventId !== "string") {
      throw Error('"eventId" was not passed in dynamic api path.');
    }

    const event = await prismaClient.event.findUnique({
      where: { id: eventId },
      include: { creator: true },
    });

    if (!event) {
      return sendBackendError(res, {
        code: BackendResponseStatusCode.NOT_FOUND,
        label: BackendErrorLabel.EVENT_DOES_NOT_EXIST,
      });
    }

    return res.status(BackendResponseStatusCode.SUCCESS).send({ data: event });
  }),

  PUT: withApiAuth(
    withValidatedJSONRequestBody(EventDataUpdateSchema)(async (req, res) => {
      const { eventId } = req.query;
      if (typeof eventId !== "string") {
        throw Error('"eventId" was not passed in dynamic api path.');
      }

      const eventData = req.parsedBody;

      try {
        const updatedEvent = await prismaClient.event.update({
          where: { id: eventId },
          data: eventData,
        });

        return res
          .status(BackendResponseStatusCode.SUCCESS)
          .send({ data: updatedEvent });
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === PrismaErrorCode.RECORD_NOT_FOUND_OR_RESTRICTED) {
            return sendBackendError(res, {
              code: BackendResponseStatusCode.NOT_FOUND,
              label: BackendErrorLabel.EVENT_DOES_NOT_EXIST,
              message: error.message,
            });
          }
          if (error.code === PrismaErrorCode.FOREIGN_KEY_NOT_FOUND) {
            return sendBackendError(res, {
              code: BackendResponseStatusCode.NOT_FOUND,
              label: BackendErrorLabel.ORDER_DOES_NOT_EXIST,
              message: error.message,
            });
          }
        }
        throw error;
      }
    })
  ),

  DELETE: withApiAuth(async (req, res) => {
    const { eventId } = req.query;
    if (typeof eventId !== "string") {
      throw Error('"eventId" was not passed in dynamic api path.');
    }

    try {
      const deletedEvent = await prismaClient.event.delete({
        where: { id: eventId },
      });

      return res
        .status(BackendResponseStatusCode.SUCCESS)
        .send({ data: deletedEvent });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCode.RECORD_NOT_FOUND_OR_RESTRICTED) {
          return sendBackendError(res, {
            code: BackendResponseStatusCode.NOT_FOUND,
            label: BackendErrorLabel.EVENT_DOES_NOT_EXIST,
            message: error.message,
          });
        }
      }
      throw error;
    }
  }),
});
