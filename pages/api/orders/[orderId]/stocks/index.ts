import { prismaClient } from "../../../../../lib/prisma/prismaClient";
import { z } from "zod";
import { BackendResponseStatusCode } from "../../../../../lib/server/BackendError/BackendError";
import { withApiAuth } from "../../../../../lib/server/middlewares/withApiAuth";
import { withApiMethods } from "../../../../../lib/server/middlewares/withApiMethods";
import { withValidatedJSONRequestBody } from "../../../../../lib/server/middlewares/withValidatedJSONRequestBody";
import { CommodityStockOrderDataSchema } from "../../../../../lib/schema/commodityStockData";

export default withApiMethods({
  POST: withApiAuth(
    withValidatedJSONRequestBody(
      z.union([
        CommodityStockOrderDataSchema,
        z.array(CommodityStockOrderDataSchema),
      ])
    )(async (req, res) => {
      const stock = req.parsedBody;

      if (Array.isArray(stock)) {
        const createdStocks = await prismaClient.commodityStock.createMany({
          data: stock,
        });

        return res
          .status(BackendResponseStatusCode.SUCCESS)
          .send({ data: createdStocks });
      }

      const createdStock = await prismaClient.commodityStock.create({
        data: stock,
      });

      return res
        .status(BackendResponseStatusCode.SUCCESS)
        .send({ data: createdStock });
    })
  ),

  GET: withApiAuth(async (req, res) => {
    const { orderId } = req.query;
    if (typeof orderId !== "string") {
      throw Error('"orderId" was not passed in dynamic api path.');
    }

    const stocks = await prismaClient.commodityStock.findMany({
      where: { orderId },
    });

    return res.status(BackendResponseStatusCode.SUCCESS).send({ data: stocks });
  }),
});
