import { prismaClient } from "../../../lib/prisma/prismaClient";
import { CommodityStockOrderData } from "../../../lib/schema/commodityStockData";
import { OrderCreateSchema } from "../../../lib/schema/orderData";
import {
  BackendErrorLabel,
  BackendResponseStatusCode,
  sendBackendError,
} from "../../../lib/server/BackendError/BackendError";
import { withApiAuth } from "../../../lib/server/middlewares/withApiAuth";
import { withApiMethods } from "../../../lib/server/middlewares/withApiMethods";
import { withValidatedJSONRequestBody } from "../../../lib/server/middlewares/withValidatedJSONRequestBody";

export default withApiMethods({
  POST: withApiAuth(
    withValidatedJSONRequestBody(OrderCreateSchema)(async (req, res) => {
      const {
        stocks: requestedStocks,
        storageId,
        ...orderData
      } = req.parsedBody;

      return await prismaClient.$transaction(async (tx) => {
        const orderStocksToCreate: CommodityStockOrderData[] = [];

        for (const requestedStock of requestedStocks) {
          const storageCommodityStock = await tx.commodityStock.findFirst({
            where: { storageId, commodityId: requestedStock.commodityId },
          });

          //check if commodity stock exists in our storage
          if (!storageCommodityStock) {
            return sendBackendError(res, {
              code: BackendResponseStatusCode.NOT_FOUND,
              label: BackendErrorLabel.STOCK_DOES_NOT_EXIST,
            });
          }

          //decrease the amount of stock in storage
          const requestedPackagesAmount = requestedStock.packagesAmount;
          const storagePackagesAmount = storageCommodityStock.packagesAmount;

          const decreasedPackagesAmount =
            storagePackagesAmount - requestedPackagesAmount;
          await tx.commodityStock.update({
            where: { id: storageCommodityStock.id },
            data: { packagesAmount: decreasedPackagesAmount },
          });

          //we're able to order this stock
          orderStocksToCreate.push(requestedStock);
        }

        const createdOrder = await prismaClient.order.create({
          data: {
            ...orderData,
            stocks: { createMany: { data: orderStocksToCreate } },
          },
        });

        return res
          .status(BackendResponseStatusCode.SUCCESS)
          .send({ data: createdOrder });
      });
    })
  ),

  GET: withApiAuth(async (_req, res) => {
    const orders = await prismaClient.order.findMany({
      select: { client: true, destination: true },
    });

    return res.status(BackendResponseStatusCode.SUCCESS).send({ data: orders });
  }),
});
