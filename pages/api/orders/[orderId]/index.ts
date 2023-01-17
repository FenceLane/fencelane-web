import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { prismaClient } from "../../../../lib/prisma/prismaClient";
import { OrderUpdateSchema } from "../../../../lib/schema/orderData";
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
    const { orderId } = req.query;
    if (typeof orderId !== "string") {
      throw Error('"orderId" was not passed in dynamic api path.');
    }

    const order = await prismaClient.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return sendBackendError(res, {
        code: BackendResponseStatusCode.NOT_FOUND,
        label: BackendErrorLabel.ORDER_DOES_NOT_EXISTS,
      });
    }

    return res.status(BackendResponseStatusCode.SUCCESS).send({ data: order });
  }),

  PUT: withApiAuth(
    withValidatedJSONRequestBody(OrderUpdateSchema)(async (req, res) => {
      const { orderId } = req.query;
      if (typeof orderId !== "string") {
        throw Error('"orderId" was not passed in dynamic api path.');
      }

      const orderData = req.parsedBody;

      try {
        const updatedOrder = await prismaClient.order.update({
          where: { id: orderId },
          data: orderData,
        });

        return res
          .status(BackendResponseStatusCode.SUCCESS)
          .send({ data: updatedOrder });
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === PrismaErrorCode.SEARCHED_RECORD_NOT_FOUND) {
            sendBackendError(res, {
              code: BackendResponseStatusCode.NOT_FOUND,
              label: BackendErrorLabel.ORDER_DOES_NOT_EXISTS,
              message: error.message,
            });
          }
        }
        throw error;
      }
    })
  ),

  DELETE: withApiAuth(async (req, res) => {
    const { orderId } = req.query;
    if (typeof orderId !== "string") {
      throw Error('"orderId" was not passed in dynamic api path.');
    }

    const deletedOrder = await prismaClient.order.delete({
      where: { id: orderId },
    });

    return res
      .status(BackendResponseStatusCode.SUCCESS)
      .send({ data: deletedOrder });
  }),
});
