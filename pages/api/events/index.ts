import { User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { prismaClient } from "../../../lib/prisma/prismaClient";
import {
  BackendErrorLabel,
  BackendResponseStatusCode,
  PrismaErrorCode,
  sendBackendError,
} from "../../../lib/server/BackendError/BackendError";
import { withApiAuth } from "../../../lib/server/middlewares/withApiAuth";
import { withApiMethods } from "../../../lib/server/middlewares/withApiMethods";
import { withValidatedJSONRequestBody } from "../../../lib/server/middlewares/withValidatedJSONRequestBody";
import { EventDataSchema } from "../../../lib/schema/eventData";
import { EVENT_VISIBILITY } from "../../../lib/types";

export default withApiMethods({
  POST: withApiAuth(
    withValidatedJSONRequestBody(EventDataSchema)(async (req, res) => {
      //FIXME: improve types for req.session.user
      const creator = (req as typeof req & { session: { user: User } }).session
        .user;

      const eventData = req.parsedBody;

      try {
        const createdEvent = await prismaClient.event.create({
          data: {
            ...eventData,
            creatorId: creator.id,
          },
        });

        return res
          .status(BackendResponseStatusCode.SUCCESS)
          .send({ data: createdEvent });
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
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

  GET: withApiAuth(async (req, res) => {
    const events = await prismaClient.event.findMany({
      include: { creator: true },
      where: {
        OR: [
          { visibility: EVENT_VISIBILITY.PUBLIC },
          { creatorId: req.session.userId },
        ],
      },
    });

    return res.status(BackendResponseStatusCode.SUCCESS).send({ data: events });
  }),
});
