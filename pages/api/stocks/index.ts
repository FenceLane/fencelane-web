import { prismaClient } from "../../../lib/prisma/prismaClient";
import { z } from "zod";
import {
  CommodityStockOrderDataSchema,
  CommodityStockStorageDataSchema,
} from "../../../lib/schema/commodityStockData";
import { BackendResponseStatusCode } from "../../../lib/server/BackendError/BackendError";
import { withApiAuth } from "../../../lib/server/middlewares/withApiAuth";
import { withApiMethods } from "../../../lib/server/middlewares/withApiMethods";
import { withValidatedJSONRequestBody } from "../../../lib/server/middlewares/withValidatedJSONRequestBody";

export default withApiMethods({
  POST: withApiAuth(
    withValidatedJSONRequestBody(
      z.union([
        CommodityStockOrderDataSchema,
        CommodityStockStorageDataSchema,
        z.array(
          z.union([
            CommodityStockOrderDataSchema,
            CommodityStockStorageDataSchema,
          ])
        ),
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

  GET: withApiAuth(async (_req, res) => {
    const stocks = await prismaClient.commodityStock.findMany();
    return res.status(BackendResponseStatusCode.SUCCESS).send({ data: stocks });
  }),
});
