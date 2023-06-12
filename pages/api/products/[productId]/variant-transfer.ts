import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { prismaClient } from "../../../../lib/prisma/prismaClient";
import { ProductVariantTransferDataSchema } from "../../../../lib/schema/productData";
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
  POST: withApiAuth(
    withValidatedJSONRequestBody(ProductVariantTransferDataSchema)(
      async (req, res) => {
        const { productId } = req.query;
        if (typeof productId !== "string") {
          throw Error('"productId" was not passed in dynamic api path.');
        }

        try {
          return await prismaClient.$transaction(async (tx) => {
            const product = await tx.product.findUnique({
              where: { id: productId },
            });

            if (!product) {
              return sendBackendError(res, {
                code: BackendResponseStatusCode.NOT_FOUND,
                label: BackendErrorLabel.PRODUCT_DOES_NOT_EXIST,
              });
            }

            const { amount: newAmount, variant: newVariant } = req.parsedBody;

            //if this product exists, update its stock
            await tx.product.update({
              where: { id: productId },
              data: { stock: product.stock - newAmount },
              include: { category: true },
            });

            const newVariantProduct = await tx.product.findFirst({
              where: {
                categoryId: product.categoryId,
                dimensions: product.dimensions,
                itemsPerPackage: product.itemsPerPackage,
                variant: newVariant,
              },
            });

            //if this product with provided variant does not exist, create it
            if (!newVariantProduct) {
              const {
                categoryId,
                dimensions,
                itemsPerPackage,
                volumePerPackage,
              } = product;
              const createdNewVariantProduct = await tx.product.create({
                data: {
                  categoryId,
                  dimensions,
                  itemsPerPackage,
                  volumePerPackage,
                  stock: newAmount,
                  variant: newVariant,
                },
              });

              return res
                .status(BackendResponseStatusCode.SUCCESS)
                .send({ data: createdNewVariantProduct });
            }

            const updatedProduct = await tx.product.update({
              where: { id: newVariantProduct.id },
              data: { stock: newVariantProduct.stock + newAmount },
              include: { category: true },
            });

            return res
              .status(BackendResponseStatusCode.SUCCESS)
              .send({ data: updatedProduct });
          });
        } catch (error) {
          if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === PrismaErrorCode.RECORD_NOT_FOUND_OR_RESTRICTED) {
              return sendBackendError(res, {
                code: BackendResponseStatusCode.NOT_FOUND,
                label: BackendErrorLabel.PRODUCT_DOES_NOT_EXIST,
                message: error.message,
              });
            }

            if (error.code === PrismaErrorCode.FOREIGN_KEY_NOT_FOUND) {
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
});
