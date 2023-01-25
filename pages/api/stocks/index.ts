import { prismaClient } from "../../../lib/prisma/prismaClient";
import { z } from "zod";
import {
  CommodityStockOrderDataSchema,
  CommodityStockStorageDataSchema,
} from "../../../lib/schema/commodityStockData";
import {
  BackendErrorLabel,
  BackendResponseStatusCode,
  PrismaErrorCode,
  sendBackendError,
} from "../../../lib/server/BackendError/BackendError";
import { withApiAuth } from "../../../lib/server/middlewares/withApiAuth";
import { withApiMethods } from "../../../lib/server/middlewares/withApiMethods";
import { withValidatedJSONRequestBody } from "../../../lib/server/middlewares/withValidatedJSONRequestBody";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

const getErrorLabelFromMeta = (meta: Record<string, unknown> | undefined) => {
  if (meta && "field_name" in meta) {
    const fieldName = meta["field_name"];
    if (typeof fieldName === "string") {
      if (fieldName.includes("commodityId")) {
        return BackendErrorLabel.COMMODITY_DOES_NOT_EXIST;
      }
      if (fieldName.includes("storageId")) {
        return BackendErrorLabel.STORAGE_DOES_NOT_EXIST;
      }
      if (fieldName.includes("orderId")) {
        return BackendErrorLabel.ORDER_DOES_NOT_EXIST;
      }
    }
  }
  return null;
};

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

      try {
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
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === PrismaErrorCode.FOREIGN_KEY_NOT_FOUND) {
            const backendErrorLabel = getErrorLabelFromMeta(error.meta);
            if (backendErrorLabel) {
              return sendBackendError(res, {
                code: BackendResponseStatusCode.NOT_FOUND,
                label: backendErrorLabel,
                message: error.message,
              });
            }
          }
        }
        throw error;
      }
    })
  ),

  GET: withApiAuth(async (_req, res) => {
    const stocks = await prismaClient.commodityStock.findMany();
    return res.status(BackendResponseStatusCode.SUCCESS).send({ data: stocks });
  }),
});
