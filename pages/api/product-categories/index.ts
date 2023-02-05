import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { prismaClient } from "../../../lib/prisma/prismaClient";
import { ProductCategoryDataCreateSchema } from "../../../lib/schema/productCategory";
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
    withValidatedJSONRequestBody(ProductCategoryDataCreateSchema)(
      async (req, res) => {
        const newProductCategoryData = req.parsedBody;

        try {
          const createdProductCategory =
            await prismaClient.productCategory.create({
              data: newProductCategoryData,
            });

          return res
            .status(BackendResponseStatusCode.SUCCESS)
            .send({ data: createdProductCategory });
        } catch (error) {
          if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === PrismaErrorCode.UNIQUE_CONSTRAINT_FAILED) {
              sendBackendError(res, {
                code: BackendResponseStatusCode.CONFLICT,
                label: BackendErrorLabel.PRODUCT_CATEGORY_ALREADY_EXISTS,
                message: error.message,
              });
            }
          }
          throw error;
        }
      }
    )
  ),

  GET: withApiAuth(async (_req, res) => {
    const productCategories = await prismaClient.productCategory.findMany({});

    return res
      .status(BackendResponseStatusCode.SUCCESS)
      .send({ data: productCategories });
  }),
});
