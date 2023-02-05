import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { prismaClient } from "../../../../lib/prisma/prismaClient";
import { ProductDataCreateSchema } from "../../../../lib/schema/productData";
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
    const { productId } = req.query;
    if (typeof productId !== "string") {
      throw Error('"productId" was not passed in dynamic api path.');
    }

    const product = await prismaClient.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return sendBackendError(res, {
        code: BackendResponseStatusCode.NOT_FOUND,
        label: BackendErrorLabel.PRODUCT_DOES_NOT_EXIST,
      });
    }

    return res
      .status(BackendResponseStatusCode.SUCCESS)
      .send({ data: product });
  }),

  PUT: withApiAuth(
    withValidatedJSONRequestBody(ProductDataCreateSchema)(async (req, res) => {
      const { productId } = req.query;
      if (typeof productId !== "string") {
        throw Error('"productId" was not passed in dynamic api path.');
      }

      const productData = req.parsedBody;

      try {
        const updatedProduct = await prismaClient.product.update({
          where: { id: productId },
          data: productData,
        });

        return res
          .status(BackendResponseStatusCode.SUCCESS)
          .send({ data: updatedProduct });
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === PrismaErrorCode.RECORD_NOT_FOUND) {
            sendBackendError(res, {
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

  DELETE: withApiAuth(async (req, res) => {
    const { productId } = req.query;
    if (typeof productId !== "string") {
      throw Error('"productId" was not passed in dynamic api path.');
    }

    try {
      const deletedProduct = await prismaClient.product.delete({
        where: { id: productId },
      });

      return res
        .status(BackendResponseStatusCode.SUCCESS)
        .send({ data: deletedProduct });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCode.RECORD_NOT_FOUND) {
          sendBackendError(res, {
            code: BackendResponseStatusCode.NOT_FOUND,
            label: BackendErrorLabel.PRODUCT_DOES_NOT_EXIST,
            message: error.message,
          });
        }
      }
      throw error;
    }
  }),
});
