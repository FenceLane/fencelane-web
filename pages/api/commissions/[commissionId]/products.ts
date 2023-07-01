import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { prismaClient } from "../../../../lib/prisma/prismaClient";
import {
  BackendError,
  BackendErrorLabel,
  BackendResponseStatusCode,
  PrismaErrorCode,
  sendBackendError,
} from "../../../../lib/server/BackendError/BackendError";
import { withApiAuth } from "../../../../lib/server/middlewares/withApiAuth";
import { withApiMethods } from "../../../../lib/server/middlewares/withApiMethods";
import { withValidatedJSONRequestBody } from "../../../../lib/server/middlewares/withValidatedJSONRequestBody";
import { ProductCommissionDataFillSchema } from "../../../../lib/schema/productCommissionData";
import { z } from "zod";

export default withApiMethods({
  GET: withApiAuth(async (req, res) => {
    const { commissionId } = req.query;

    if (typeof commissionId !== "string") {
      throw Error('"commissionId" was not passed in dynamic api path.');
    }

    const orderProducts = await prismaClient.productCommission.findMany({
      where: { commissionId: Number(commissionId) },
      include: {
        product: true,
      },
    });

    return res
      .status(BackendResponseStatusCode.SUCCESS)
      .send({ data: orderProducts });
  }),

  //ability to update commission products, once all products are fulfilled we can delete the commission
  PATCH: withApiAuth(
    withValidatedJSONRequestBody(
      z.union([
        z.array(ProductCommissionDataFillSchema),
        ProductCommissionDataFillSchema,
      ])
    )(async (req, res) => {
      const { commissionId } = req.query;
      if (typeof commissionId !== "string") {
        throw Error('"commissionId" was not passed in dynamic api path.');
      }

      const data = req.parsedBody;
      const productCommissionData = Array.isArray(data) ? data : [data];

      try {
        await prismaClient.$transaction(async (tx) => {
          await Promise.all(
            productCommissionData.map(
              async ({
                productCommissionId,
                filledQuantity: filledQuantity,
              }) => {
                const productCommission = await tx.productCommission.findUnique(
                  {
                    where: { id: productCommissionId },
                    include: {
                      product: true,
                    },
                  }
                );

                if (!productCommission) {
                  throw new BackendError({
                    code: BackendResponseStatusCode.NOT_FOUND,
                    label: BackendErrorLabel.PRODUCT_COMMISSION_DOES_NOT_EXIST,
                  });
                }

                if (filledQuantity > productCommission.quantity) {
                  throw new BackendError({
                    code: BackendResponseStatusCode.BAD_REQUEST,
                    label:
                      BackendErrorLabel.QUANTITY_EXCEEDS_PRODUCT_COMMISSION_QUANTITY,
                    message: `Quantity exceeds product commission quantity. Product commission quantity: ${productCommission.quantity}, filled quantity: ${filledQuantity}, product-commission id: ${productCommission.productId}`,
                  });
                }

                //update stock
                await tx.product.update({
                  where: { id: productCommission.productId },
                  data: {
                    stock: {
                      increment: filledQuantity,
                    },
                  },
                });

                //quantity that is still left to be fulfilled after this update
                const quantityLeft =
                  productCommission.quantity - filledQuantity;

                if (quantityLeft === 0) {
                  //if quantity left is 0 or below, delete the product commission
                  return tx.productCommission.delete({
                    where: { id: productCommissionId },
                  });
                }

                //otherwise update commission product
                return tx.productCommission.update({
                  where: { id: productCommissionId },
                  data: {
                    quantity: {
                      decrement: filledQuantity,
                    },
                  },
                });
              }
            )
          );

          const updatedCommission = await tx.commission.findUnique({
            where: { id: Number(commissionId) },
            include: {
              products: true,
            },
          });

          if (!updatedCommission) {
            return sendBackendError(res, {
              code: BackendResponseStatusCode.NOT_FOUND,
              label: BackendErrorLabel.COMMISSION_DOES_NOT_EXIST,
            });
          }

          //if all products are fulfilled, delete the commission
          if (updatedCommission.products.length === 0) {
            await tx.commission.delete({
              where: { id: Number(commissionId) },
            });
          }

          return res
            .status(BackendResponseStatusCode.SUCCESS)
            .send({ data: updatedCommission });
        });
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === PrismaErrorCode.RECORD_NOT_FOUND_OR_RESTRICTED) {
            return sendBackendError(res, {
              code: BackendResponseStatusCode.NOT_FOUND,
              label: BackendErrorLabel.PRODUCT_COMMISSION_DOES_NOT_EXIST,
              message: error.message,
            });
          }
        }
        throw error;
      }
    })
  ),
});
