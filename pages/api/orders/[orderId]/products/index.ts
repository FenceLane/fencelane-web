import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { prismaClient } from "../../../../../lib/prisma/prismaClient";
import { z } from "zod";

import {
  BackendErrorLabel,
  BackendResponseStatusCode,
  PrismaErrorCode,
  sendBackendError,
} from "../../../../../lib/server/BackendError/BackendError";
import { withApiAuth } from "../../../../../lib/server/middlewares/withApiAuth";
import { withApiMethods } from "../../../../../lib/server/middlewares/withApiMethods";
import { withValidatedJSONRequestBody } from "../../../../../lib/server/middlewares/withValidatedJSONRequestBody";
import { ProductOrderDataUpdateSchema } from "../../../../../lib/schema/productOrderData";

export default withApiMethods({
  GET: withApiAuth(async (req, res) => {
    const { orderId } = req.query;

    if (typeof orderId !== "string") {
      throw Error('"orderId" was not passed in dynamic api path.');
    }

    const orderProducts = await prismaClient.productOrder.findMany({
      where: { orderId: Number(orderId) },
      include: {
        product: true,
      },
    });

    return res
      .status(BackendResponseStatusCode.SUCCESS)
      .send({ data: orderProducts });
  }),

  PATCH: withApiAuth(
    withValidatedJSONRequestBody(
      z.union([
        z.array(ProductOrderDataUpdateSchema),
        ProductOrderDataUpdateSchema,
      ])
    )(async (req, res) => {
      const { orderId } = req.query;
      if (typeof orderId !== "string") {
        throw Error('"orderId" was not passed in dynamic api path.');
      }

      const data = req.parsedBody;
      const productOrderData = Array.isArray(data) ? data : [data];

      try {
        await prismaClient.$transaction(async (tx) => {
          const updatedProducts = await Promise.all(
            productOrderData.map(async ({ productOrderId, ...data }) => {
              const updatedProductOrder = await tx.productOrder.update({
                where: { id: productOrderId },
                data,
              });
              return updatedProductOrder;
            })
          );

          return res
            .status(BackendResponseStatusCode.SUCCESS)
            .send({ data: updatedProducts });
        });
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === PrismaErrorCode.RECORD_NOT_FOUND_OR_RESTRICTED) {
            return sendBackendError(res, {
              code: BackendResponseStatusCode.NOT_FOUND,
              label: BackendErrorLabel.PRODUCT_ORDER_DOES_NOT_EXIST,
              message: error.message,
            });
          }
        }
        throw error;
      }
    })
  ),
});