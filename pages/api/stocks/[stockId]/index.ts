import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { prismaClient } from "../../../../lib/prisma/prismaClient";
import { CommodityStockDataSchema } from "../../../../lib/schema/commodityStockData";
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
    const { stockId } = req.query;
    if (typeof stockId !== "string") {
      throw Error('"stockId" was not passed in dynamic api path.');
    }

    const stock = await prismaClient.commodityStock.findUnique({
      where: { id: stockId },
    });

    if (!stock) {
      return sendBackendError(res, {
        code: BackendResponseStatusCode.NOT_FOUND,
        label: BackendErrorLabel.STOCK_DOES_NOT_EXISTS,
      });
    }

    return res.status(BackendResponseStatusCode.SUCCESS).send({ data: stock });
  }),

  PUT: withApiAuth(
    withValidatedJSONRequestBody(CommodityStockDataSchema)(async (req, res) => {
      const { stockId } = req.query;
      if (typeof stockId !== "string") {
        throw Error('"stockId" was not passed in dynamic api path.');
      }

      const stockData = req.parsedBody;

      try {
        const updatedStock = await prismaClient.commodityStock.update({
          where: { id: stockId },
          data: stockData,
        });

        return res
          .status(BackendResponseStatusCode.SUCCESS)
          .send({ data: updatedStock });
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === PrismaErrorCode.SEARCHED_RECORD_NOT_FOUND) {
            sendBackendError(res, {
              code: BackendResponseStatusCode.NOT_FOUND,
              label: BackendErrorLabel.STOCK_DOES_NOT_EXISTS,
              message: error.message,
            });
          }
        }
        throw error;
      }
    })
  ),

  DELETE: withApiAuth(async (req, res) => {
    const { stockId } = req.query;
    if (typeof stockId !== "string") {
      throw Error('"stockId" was not passed in dynamic api path.');
    }

    try {
      const deletedStock = await prismaClient.commodityStock.delete({
        where: { id: stockId },
      });

      return res
        .status(BackendResponseStatusCode.SUCCESS)
        .send({ data: deletedStock });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCode.SEARCHED_RECORD_NOT_FOUND) {
          sendBackendError(res, {
            code: BackendResponseStatusCode.NOT_FOUND,
            label: BackendErrorLabel.STOCK_DOES_NOT_EXISTS,
            message: error.message,
          });
        }
      }
      throw error;
    }
  }),
});
