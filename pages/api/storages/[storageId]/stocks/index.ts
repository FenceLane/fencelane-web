import { prismaClient } from "../../../../../lib/prisma/prismaClient";
import { z } from "zod";
import { CommodityStockStorageDataSchema } from "../../../../../lib/schema/commodityStockData";
import { BackendResponseStatusCode } from "../../../../../lib/server/BackendError/BackendError";
import { withApiAuth } from "../../../../../lib/server/middlewares/withApiAuth";
import { withApiMethods } from "../../../../../lib/server/middlewares/withApiMethods";
import { withValidatedJSONRequestBody } from "../../../../../lib/server/middlewares/withValidatedJSONRequestBody";

export default withApiMethods({
  POST: withApiAuth(
    withValidatedJSONRequestBody(
      z.union([
        CommodityStockStorageDataSchema,
        z.array(CommodityStockStorageDataSchema),
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
    const { storageId } = req.query;
    if (typeof storageId !== "string") {
      throw Error('"storageId" was not passed in dynamic api path.');
    }

    const stocks = await prismaClient.commodityStock.findMany({
      where: { storageId },
    });

    return res.status(BackendResponseStatusCode.SUCCESS).send({ data: stocks });
  }),

  //TODO: add PUT and DELETE endpoints
});
