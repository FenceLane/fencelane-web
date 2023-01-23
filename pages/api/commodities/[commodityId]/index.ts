import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { prismaClient } from "../../../../lib/prisma/prismaClient";
import { CommodityDataBaseSchema } from "../../../../lib/schema/commodityData";
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
    const { commodityId } = req.query;
    if (typeof commodityId !== "string") {
      throw Error('"commodityId" was not passed in dynamic api path.');
    }

    const commodity = await prismaClient.commodity.findUnique({
      where: { id: commodityId },
      include: { stocks: false },
    });

    if (!commodity) {
      return sendBackendError(res, {
        code: BackendResponseStatusCode.NOT_FOUND,
        label: BackendErrorLabel.COMMODITY_DOES_NOT_EXIST,
      });
    }

    return res
      .status(BackendResponseStatusCode.SUCCESS)
      .send({ data: commodity });
  }),

  PUT: withApiAuth(
    withValidatedJSONRequestBody(CommodityDataBaseSchema)(async (req, res) => {
      const { commodityId } = req.query;
      if (typeof commodityId !== "string") {
        throw Error('"commodityId" was not passed in dynamic api path.');
      }

      const commodityData = req.parsedBody;

      try {
        const commodityOrder = await prismaClient.commodity.update({
          where: { id: commodityId },
          data: commodityData,
        });

        return res
          .status(BackendResponseStatusCode.SUCCESS)
          .send({ data: commodityOrder });
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === PrismaErrorCode.RECORD_NOT_FOUND) {
            sendBackendError(res, {
              code: BackendResponseStatusCode.NOT_FOUND,
              label: BackendErrorLabel.COMMODITY_DOES_NOT_EXIST,
              message: error.message,
            });
          }
        }
        throw error;
      }
    })
  ),

  DELETE: withApiAuth(async (req, res) => {
    const { commodityId } = req.query;
    if (typeof commodityId !== "string") {
      throw Error('"commodityId" was not passed in dynamic api path.');
    }

    try {
      const deletedCommodity = await prismaClient.commodity.delete({
        where: { id: commodityId },
      });

      return res
        .status(BackendResponseStatusCode.SUCCESS)
        .send({ data: deletedCommodity });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCode.RECORD_NOT_FOUND) {
          sendBackendError(res, {
            code: BackendResponseStatusCode.NOT_FOUND,
            label: BackendErrorLabel.COMMODITY_DOES_NOT_EXIST,
            message: error.message,
          });
        }
      }
      throw error;
    }
  }),
});
