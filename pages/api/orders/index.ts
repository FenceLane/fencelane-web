import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { prismaClient } from "../../../lib/prisma/prismaClient";
import { OrderDataSchema } from "../../../lib/schema/orderData";
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
    withValidatedJSONRequestBody(OrderDataSchema)(async (req, res) => {
      const { products: requestedProducts, ...orderData } = req.parsedBody;

      try {
        return await prismaClient.$transaction(async (tx) => {
          //reduce stock value of requested products
          await Promise.all(
            requestedProducts.map(async (requestedProduct) =>
              tx.product.update({
                where: { id: requestedProduct.productId },
                data: { stock: { decrement: requestedProduct.quantity } },
              })
            )
          );

          const createdOrder = await prismaClient.order.create({
            data: {
              ...orderData,
              products: { createMany: { data: requestedProducts } },
            },
            include: { products: true, client: true, destination: true },
          });

          return res
            .status(BackendResponseStatusCode.SUCCESS)
            .send({ data: createdOrder });
        });
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === PrismaErrorCode.FOREIGN_KEY_NOT_FOUND) {
            const label = getLabelFromPrismaError(error);
            return sendBackendError(res, {
              code: BackendResponseStatusCode.NOT_FOUND,
              label,
              message: error.message,
            });
          }

          if (error.code === PrismaErrorCode.RECORD_NOT_FOUND_OR_RESTRICTED) {
            return sendBackendError(res, {
              code: BackendResponseStatusCode.NOT_FOUND,
              label: BackendErrorLabel.PRODUCT_DOES_NOT_EXIST,
              message: error.message,
            });
          }
        }
        throw error;
      }
    })
  ),

  GET: withApiAuth(async (_req, res) => {
    const orders = await prismaClient.order.findMany({
      select: { client: true, destination: true, products: true },
    });

    return res.status(BackendResponseStatusCode.SUCCESS).send({ data: orders });
  }),
});

const getLabelFromPrismaError = (error: PrismaClientKnownRequestError) => {
  const fieldName = error.meta?.field_name;
  if (!fieldName || typeof fieldName !== "string") {
    throw error;
  }

  if (fieldName.includes("clientId")) {
    return BackendErrorLabel.CLIENT_DOES_NOT_EXIST;
  }

  if (fieldName.includes("destinationId")) {
    return BackendErrorLabel.DESTINATION_DOES_NOT_EXIST;
  }

  throw error;
};
