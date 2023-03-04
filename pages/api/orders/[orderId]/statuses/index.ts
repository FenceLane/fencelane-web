import { User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { prismaClient } from "../../../../../lib/prisma/prismaClient";
import { OrderStatusDataSchema } from "../../../../../lib/schema/orderStatusData";
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
    withValidatedJSONRequestBody(OrderStatusDataSchema)(async (req, res) => {
      const { orderId } = req.query;
      if (typeof orderId !== "string") {
        throw Error('"orderId" was not passed in dynamic api path.');
      }

      //FIXME: improve types for req.session.user
      const creator = (req as typeof req & { session: { user: User } }).session
        .user;

      const orderStatusData = req.parsedBody;

      try {
        const createdOrderStatus = await prismaClient.orderStatus.create({
          data: {
            ...orderStatusData,
            creatorId: creator.id,
            orderId: Number(orderId),
          },
        });

        return res
          .status(BackendResponseStatusCode.SUCCESS)
          .send({ data: createdOrderStatus });
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
    const { orderId } = req.query;
    if (typeof orderId !== "string") {
      throw Error('"orderId" was not passed in dynamic api path.');
    }

    const orderStatuses = await prismaClient.orderStatus.findMany({
      where: { orderId: Number(orderId) },
      include: { creator: true },
    });

    return res
      .status(BackendResponseStatusCode.SUCCESS)
      .send({ data: orderStatuses });
  }),
});
