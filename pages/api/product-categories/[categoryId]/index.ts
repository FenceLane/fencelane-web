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

export default withApiMethods({
  GET: withApiAuth(async (req, res) => {
    const { categoryId } = req.query;
    if (typeof categoryId !== "string") {
      throw Error('"categoryId" was not passed in dynamic api path.');
    }

    const productCategory = await prismaClient.product.findUnique({
      where: { id: categoryId },
    });

    if (!productCategory) {
      return sendBackendError(res, {
        code: BackendResponseStatusCode.NOT_FOUND,
        label: BackendErrorLabel.PRODUCT_DOES_NOT_EXIST,
      });
    }

    return res
      .status(BackendResponseStatusCode.SUCCESS)
      .send({ data: productCategory });
  }),

  PUT: withApiAuth(
    withValidatedJSONRequestBody(ProductCategoryDataCreateSchema)(
      async (req, res) => {
        const { categoryId } = req.query;
        if (typeof categoryId !== "string") {
          throw Error('"categoryId" was not passed in dynamic api path.');
        }

        const productCategoryData = req.parsedBody;

        try {
          const updatedProduct = await prismaClient.productCategory.update({
            where: { id: categoryId },
            data: productCategoryData,
          });

          return res
            .status(BackendResponseStatusCode.SUCCESS)
            .send({ data: updatedProduct });
        } catch (error) {
          if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === PrismaErrorCode.RECORD_NOT_FOUND) {
              sendBackendError(res, {
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
      const deletedProductCategory = await prismaClient.product.delete({
        where: { id: categoryId },
      });

      return res
        .status(BackendResponseStatusCode.SUCCESS)
        .send({ data: deletedProductCategory });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCode.RECORD_NOT_FOUND) {
          sendBackendError(res, {
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
