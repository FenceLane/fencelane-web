import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { z } from "zod";
import { prismaClient } from "../../../../../lib/prisma/prismaClient";
import { ProductOrderExpanseDataSchema } from "../../../../../lib/schema/productOrderExpanseData";
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
    withValidatedJSONRequestBody(
      z.union([
        z.array(ProductOrderExpanseDataSchema),
        ProductOrderExpanseDataSchema,
      ])
    )(async (req, res) => {
      const { orderId } = req.query;
      if (typeof orderId !== "string") {
        throw Error('"orderId" was not passed in dynamic api path.');
      }

      const data = req.parsedBody;
      const productExpansesData = Array.isArray(data) ? data : [data];

      try {
        const createdOrderStatusesCount =
          await prismaClient.productExpanse.createMany({
            data: productExpansesData,
          });

        return res
          .status(BackendResponseStatusCode.SUCCESS)
          .send({ data: createdOrderStatusesCount });
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === PrismaErrorCode.FOREIGN_KEY_NOT_FOUND) {
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

  GET: withApiAuth(async (req, res) => {
    const { orderId } = req.query;
    if (typeof orderId !== "string") {
      throw Error('"orderId" was not passed in dynamic api path.');
    }

    const orderExpanses = await prismaClient.productExpanse.findMany({
      where: { productOrder: { orderId: Number(orderId) } },
      select: { price: true, currency: true, type: true },
    });

    return res
      .status(BackendResponseStatusCode.SUCCESS)
      .send({ data: orderExpanses });
  }),
});
