import { Product, User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { prismaClient } from "../../../lib/prisma/prismaClient";
import { OrderDataCreateSchema } from "../../../lib/schema/orderData";
import {
  BackendErrorLabel,
  BackendResponseStatusCode,
  PrismaErrorCode,
  sendBackendError,
} from "../../../lib/server/BackendError/BackendError";
import { withApiAuth } from "../../../lib/server/middlewares/withApiAuth";
import { withApiMethods } from "../../../lib/server/middlewares/withApiMethods";
import { withValidatedJSONRequestBody } from "../../../lib/server/middlewares/withValidatedJSONRequestBody";
import { ORDER_STATUS } from "../../../lib/types";
import { getLabelFromPrismaError } from "../../../lib/server/utils/getLabelFromPrismaError";

const productsToStockMap = (products: Product[]) => {
  return products.reduce<Record<string, number>>(
    (acc, product) => ({
      ...acc,
      [product.id]: product.stock,
    }),
    {}
  );
};

export default withApiMethods({
  POST: withApiAuth(
    withValidatedJSONRequestBody(OrderDataCreateSchema)(async (req, res) => {
      //FIXME: improve types for req.session.user
      const creator = (req as typeof req & { session: { user: User } }).session
        .user;
      const { products: requestedProducts, ...orderData } = req.parsedBody;

      try {
        return await prismaClient.$transaction(async (tx) => {
          const currentProducts = await tx.product.findMany({
            where: {
              id: { in: requestedProducts.map(({ productId }) => productId) },
            },
          });
          const currentProductsStockMap = productsToStockMap(currentProducts);

          //reduce stock value of requested products
          const updatedProducts = await Promise.all(
            requestedProducts.map(async (requestedProduct) =>
              tx.product.update({
                where: { id: requestedProduct.productId },
                data: { stock: { decrement: requestedProduct.quantity } },
              })
            )
          );
          const updatedProductStockMap = productsToStockMap(updatedProducts);

          const createdOrder = await tx.order.create({
            data: {
              ...orderData,
              products: { createMany: { data: requestedProducts } },
              statusHistory: {
                create: {
                  status: ORDER_STATUS.ORDER_CREATED,
                  creatorId: creator.id,
                },
              },
              creatorId: creator.id,
            },
            include: {
              products: {
                include: { product: { include: { category: true } } },
              },
              destination: { include: { client: true } },
              creator: true,
              statusHistory: { include: { creator: true } },
            },
          });

          //create commissions for the products which stock went below 0
          const commissionProductData = requestedProducts
            .map(({ productId, quantity: requestedQuantity }) => {
              const updatedProductStock = updatedProductStockMap[productId];
              if (updatedProductStock < 0) {
                // if stock goes below 0, create a commission
                const currentProductStock = currentProductsStockMap[productId];

                const base = currentProductStock < 0 ? 0 : currentProductStock;

                const neededQuantity = Math.abs(base - requestedQuantity);

                return {
                  productId,
                  quantity: neededQuantity,
                };
              }
            })
            .filter((item): item is { productId: string; quantity: number } =>
              Boolean(item)
            );

          if (commissionProductData.length > 0) {
            // do not create commission if not needed (empty list of needed products)
            await tx.commission.create({
              data: {
                orderId: createdOrder.id,
                products: {
                  createMany: {
                    data: commissionProductData,
                  },
                },
              },
            });
          }

          const orderResponse = {
            ...createdOrder,
            products: createdOrder.products.map(({ id, ...product }) => ({
              ...product,
              productOrderId: id,
            })),
          };

          return res
            .status(BackendResponseStatusCode.SUCCESS)
            .send({ data: orderResponse });
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

  GET: withApiAuth(async (req, res) => {
    const { parentOrderId, groupBy } = req.query;

    const orders = await prismaClient.order.findMany({
      include: {
        destination: { include: { client: true } },
        statusHistory: { include: { creator: true } },
        products: { include: { product: { include: { category: true } } } },
        files: true,
      },
      orderBy: { createdAt: "desc" },
      where: typeof parentOrderId === "string" ? { parentOrderId } : undefined,
    });

    const returnData = orders.map((order) => ({
      ...order,
      products: order.products.map(({ id, ...product }) => ({
        ...product,
        productOrderId: id,
      })),
    }));

    if (groupBy === "parentOrderId") {
      const groupedOrders = returnData.reduce<
        Record<string, typeof returnData>
      >((acc, order) => {
        if (order.parentOrderId) {
          acc[order.parentOrderId] = acc[order.parentOrderId]
            ? [...acc[order.parentOrderId], order]
            : [order];
        } else {
          acc.other = acc.other ? [...acc.other, order] : [order];
        }
        return acc;
      }, {});

      return res.status(BackendResponseStatusCode.SUCCESS).send({
        data: groupedOrders,
      });
    }

    return res.status(BackendResponseStatusCode.SUCCESS).send({
      data: returnData,
    });
  }),
});
