import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { prismaClient } from "../../../lib/prisma/prismaClient";
import { ProductDataCreateSchema } from "../../../lib/schema/productData";
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
    withValidatedJSONRequestBody(ProductDataCreateSchema)(async (req, res) => {
      const { categoryId, ...newProductData } = req.parsedBody;

      try {
        const createdProduct = await prismaClient.product.create({
          data: {
            ...newProductData,
            categoryId,
          },
          include: { category: true },
        });

        return res
          .status(BackendResponseStatusCode.SUCCESS)
          .send({ data: createdProduct });
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === PrismaErrorCode.UNIQUE_CONSTRAINT_FAILED) {
            return sendBackendError(res, {
              code: BackendResponseStatusCode.CONFLICT,
              label: BackendErrorLabel.PRODUCT_ALREADY_EXISTS,
              message: error.message,
            });
          }

          if (error.code === PrismaErrorCode.FOREIGN_KEY_NOT_FOUND) {
            return sendBackendError(res, {
              code: BackendResponseStatusCode.CONFLICT,
              label: BackendErrorLabel.PRODUCT_CATEGORY_DOES_NOT_EXIST,
              message: error.message,
            });
          }
        }
        throw error;
      }
    })
  ),

  GET: withApiAuth(async (_req, res) => {
    const products = await prismaClient.product.findMany({
      include: { category: true },
    });

    return res
      .status(BackendResponseStatusCode.SUCCESS)
      .send({ data: products });
  }),
});
