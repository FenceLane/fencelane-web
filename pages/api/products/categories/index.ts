import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { prismaClient } from "../../../../lib/prisma/prismaClient";
import { ProductCategoryDataCreateSchema } from "../../../../lib/schema/productCategory";
import {
  BackendErrorLabel,
  BackendResponseStatusCode,
  PrismaErrorCode,
  sendBackendError,
} from "../../../../lib/server/BackendError/BackendError";
import { withApiAuth } from "../../../../lib/server/middlewares/withApiAuth";
import { withApiMethods } from "../../../../lib/server/middlewares/withApiMethods";
import { withValidatedJSONRequestBody } from "../../../../lib/server/middlewares/withValidatedJSONRequestBody";
import { z } from "zod";

export default withApiMethods({
  POST: withApiAuth(
    withValidatedJSONRequestBody(
      z.union([
        ProductCategoryDataCreateSchema,
        z.array(ProductCategoryDataCreateSchema),
      ])
    )(async (req, res) => {
      const newProductCategoryData = req.parsedBody;

      const newProductCategories = Array.isArray(newProductCategoryData)
        ? newProductCategoryData
        : [newProductCategoryData];

      try {
        const createdProductCategories =
          await prismaClient.productCategory.createMany({
            data: newProductCategories,
          });

        return res
          .status(BackendResponseStatusCode.SUCCESS)
          .send({ data: createdProductCategories });
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === PrismaErrorCode.UNIQUE_CONSTRAINT_FAILED) {
            return sendBackendError(res, {
              code: BackendResponseStatusCode.CONFLICT,
              label: BackendErrorLabel.PRODUCT_CATEGORY_ALREADY_EXISTS,
              message: error.message,
            });
          }
        }
        throw error;
      }
    })
  ),

  GET: withApiAuth(async (_req, res) => {
    const categories = await prismaClient.productCategory.findMany({});

    return res
      .status(BackendResponseStatusCode.SUCCESS)
      .send({ data: categories });
  }),
});
