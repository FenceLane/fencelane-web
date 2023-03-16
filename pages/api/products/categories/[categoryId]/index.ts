import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { prismaClient } from "../../../../../lib/prisma/prismaClient";
import { ProductCategoryDataUpdateSchema } from "../../../../../lib/schema/productCategory";
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
  GET: withApiAuth(async (req, res) => {
    const { categoryId } = req.query;
    if (typeof categoryId !== "string") {
      throw Error('"categoryId" was not passed in dynamic api path.');
    }

    const productCategory = await prismaClient.productCategory.findUnique({
      where: { id: categoryId },
    });

    if (!productCategory) {
      return sendBackendError(res, {
        code: BackendResponseStatusCode.NOT_FOUND,
        label: BackendErrorLabel.PRODUCT_CATEGORY_DOES_NOT_EXIST,
      });
    }

    return res
      .status(BackendResponseStatusCode.SUCCESS)
      .send({ data: productCategory });
  }),

  PUT: withApiAuth(
    withValidatedJSONRequestBody(ProductCategoryDataUpdateSchema)(
      async (req, res) => {
        const { categoryId } = req.query;
        if (typeof categoryId !== "string") {
          throw Error('"categoryId" was not passed in dynamic api path.');
        }

        const productCategoryData = req.parsedBody;

        try {
          const updatedProductCategory =
            await prismaClient.productCategory.update({
              where: { id: categoryId },
              data: productCategoryData,
            });

          return res
            .status(BackendResponseStatusCode.SUCCESS)
            .send({ data: updatedProductCategory });
        } catch (error) {
          if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === PrismaErrorCode.RECORD_NOT_FOUND_OR_RESTRICTED) {
              return sendBackendError(res, {
                code: BackendResponseStatusCode.NOT_FOUND,
                label: BackendErrorLabel.PRODUCT_CATEGORY_DOES_NOT_EXIST,
                message: error.message,
              });
            }
          }
          throw error;
        }
      }
    )
  ),

  DELETE: withApiAuth(async (req, res) => {
    const { categoryId } = req.query;
    if (typeof categoryId !== "string") {
      throw Error('"categoryId" was not passed in dynamic api path.');
    }

    try {
      const deletedProductCategory = await prismaClient.productCategory.delete({
        where: { id: categoryId },
      });

      return res
        .status(BackendResponseStatusCode.SUCCESS)
        .send({ data: deletedProductCategory });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCode.RECORD_NOT_FOUND_OR_RESTRICTED) {
          return sendBackendError(res, {
            code: BackendResponseStatusCode.NOT_FOUND,
            label: BackendErrorLabel.PRODUCT_CATEGORY_DOES_NOT_EXIST,
            message: error.message,
          });
        }
      }
      throw error;
    }
  }),
});
