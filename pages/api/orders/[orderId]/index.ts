import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { prismaClient } from "../../../../lib/prisma/prismaClient";
import { OrderDataUpdateSchema } from "../../../../lib/schema/orderData";
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
      where: { id: Number(orderId) },
      include: {
        destination: { include: { client: true } },
        products: true,
        statusHistory: true,
      },
    });

    if (!order) {
      return sendBackendError(res, {
        code: BackendResponseStatusCode.NOT_FOUND,
        label: BackendErrorLabel.ORDER_DOES_NOT_EXIST,
      });
    }

    const orderResponse = {
      ...order,
      products: order.products.map(({ id, ...product }) => ({
        ...product,
        productOrderId: id,
      })),
    };

    return res
      .status(BackendResponseStatusCode.SUCCESS)
      .send({ data: orderResponse });
  }),

  PUT: withApiAuth(
    withValidatedJSONRequestBody(OrderDataUpdateSchema)(async (req, res) => {
      const { orderId } = req.query;
      if (typeof orderId !== "string") {
        throw Error('"orderId" was not passed in dynamic api path.');
      }

      const orderData = req.parsedBody;

      try {
        const updatedOrder = await prismaClient.order.update({
          where: { id: Number(orderId) },
          data: orderData,
        });

        return res
          .status(BackendResponseStatusCode.SUCCESS)
          .send({ data: updatedOrder });
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === PrismaErrorCode.RECORD_NOT_FOUND_OR_RESTRICTED) {
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
    const { orderId } = req.query;
    if (typeof orderId !== "string") {
      throw Error('"orderId" was not passed in dynamic api path.');
    }

    try {
      const deletedOrder = await prismaClient.order.delete({
        where: { id: Number(orderId) },
      });

      return res
        .status(BackendResponseStatusCode.SUCCESS)
        .send({ data: deletedOrder });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCode.RECORD_NOT_FOUND_OR_RESTRICTED) {
          return sendBackendError(res, {
            code: BackendResponseStatusCode.NOT_FOUND,
            label: BackendErrorLabel.ORDER_DOES_NOT_EXIST,
            message: error.message,
          });
        }
      }
      throw error;
    }
  }),
});
