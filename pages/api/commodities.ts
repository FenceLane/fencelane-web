import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { prismaClient } from "../../lib/prisma/prismaClient";
import { CommodityDataSchema } from "../../lib/schema/commodityData";
import {
  BackendErrorLabel,
  BackendResponseStatusCode,
  PrismaErrorCode,
  sendBackendError,
} from "../../lib/server/BackendError/BackendError";
import { withApiMethods } from "../../lib/server/middlewares/withApiMethods";
import { withValidatedJSONRequestBody } from "../../lib/server/middlewares/withValidatedJSONRequestBody";

export default withApiMethods({
  POST: withValidatedJSONRequestBody(CommodityDataSchema)(async (req, res) => {
    const { name, dimensions, stocks } = req.parsedBody;

    try {
      const createdCommodity = await prismaClient.commodity.create({
        data: { name, dimensions, stocks: { createMany: { data: stocks } } },
      });

      return res
        .status(BackendResponseStatusCode.SUCCESS)
        .send({ data: createdCommodity });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCode.UNIQUE_CONSTRAINT_FAILED) {
          sendBackendError(res, {
            code: BackendResponseStatusCode.CONFLICT,
            label: BackendErrorLabel.COMMODITY_ALREADY_EXISTS,
            message: error.message,
          });
        }
      }
      throw error;
    }
  }),
});
