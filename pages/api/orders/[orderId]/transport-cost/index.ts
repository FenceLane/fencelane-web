import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { prismaClient } from "../../../../../lib/prisma/prismaClient";
import {
  BackendErrorLabel,
  BackendResponseStatusCode,
  PrismaErrorCode,
  sendBackendError,
} from "../../../../../lib/server/BackendError/BackendError";
import { withApiAuth } from "../../../../../lib/server/middlewares/withApiAuth";
import { withApiMethods } from "../../../../../lib/server/middlewares/withApiMethods";
import { withValidatedJSONRequestBody } from "../../../../../lib/server/middlewares/withValidatedJSONRequestBody";
import {
  TransportCostDataUpdateSchema,
  TransportCostDataCreateSchema,
} from "../../../../../lib/schema/transportCostData";

export default withApiMethods({
  POST: withApiAuth(
    withValidatedJSONRequestBody(TransportCostDataCreateSchema)(
      async (req, res) => {
        const { orderId } = req.query;
        if (typeof orderId !== "string") {
          throw Error('"orderId" was not passed in dynamic api path.');
        }

        const transportCostData = req.parsedBody;

        try {
          const updatedTransportCost = await prismaClient.transportCost.create({
            data: { ...transportCostData, orderId: Number(orderId) },
          });

          return res
            .status(BackendResponseStatusCode.SUCCESS)
            .send({ data: updatedTransportCost });
        } catch (error) {
          if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === PrismaErrorCode.FOREIGN_KEY_NOT_FOUND) {
              return sendBackendError(res, {
                code: BackendResponseStatusCode.NOT_FOUND,
                label: BackendErrorLabel.ORDER_DOES_NOT_EXIST,
                message: error.message,
              });
            }
            if (error.code === PrismaErrorCode.UNIQUE_CONSTRAINT_FAILED) {
              return sendBackendError(res, {
                code: BackendResponseStatusCode.CONFLICT,
                label: BackendErrorLabel.TRAVEL_COST_ALREADY_EXISTS,
                message: error.message,
              });
            }
          }
          throw error;
        }
      }
    )
  ),

  GET: withApiAuth(async (req, res) => {
    const { orderId } = req.query;

    if (typeof orderId !== "string") {
      throw Error('"orderId" was not passed in dynamic api path.');
    }

    const transportCost = await prismaClient.transportCost.findUnique({
      where: { orderId: Number(orderId) },
    });

    if (!transportCost) {
      return sendBackendError(res, {
        code: BackendResponseStatusCode.NOT_FOUND,
        label: BackendErrorLabel.TRAVEL_COST_DOES_NOT_EXIST,
      });
    }

    return res
      .status(BackendResponseStatusCode.SUCCESS)
      .send({ data: transportCost });
  }),

  PUT: withApiAuth(
    withValidatedJSONRequestBody(TransportCostDataUpdateSchema)(
      async (req, res) => {
        const { orderId } = req.query;
        if (typeof orderId !== "string") {
          throw Error('"orderId" was not passed in dynamic api path.');
        }

        const transportCostData = req.parsedBody;

        try {
          const updatedTransportCost = await prismaClient.transportCost.update({
            where: { orderId: Number(orderId) },
            data: transportCostData,
          });

          return res
            .status(BackendResponseStatusCode.SUCCESS)
            .send({ data: updatedTransportCost });
        } catch (error) {
          if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === PrismaErrorCode.RECORD_NOT_FOUND_OR_RESTRICTED) {
              console.log("dupa");
              return sendBackendError(res, {
                code: BackendResponseStatusCode.NOT_FOUND,
                label: BackendErrorLabel.TRAVEL_COST_DOES_NOT_EXIST,
                message: error.message,
              });
            }
          }
          throw error;
        }
      }
    )
  ),

  DELETE: withApiAuth(async (req, res) => {
    const { orderId } = req.query;
    if (typeof orderId !== "string") {
      throw Error('"orderId" was not passed in dynamic api path.');
    }

    try {
      const deletedTransportCost = await prismaClient.transportCost.delete({
        where: { orderId: Number(orderId) },
      });

      return res
        .status(BackendResponseStatusCode.SUCCESS)
        .send({ data: deletedTransportCost });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCode.RECORD_NOT_FOUND_OR_RESTRICTED) {
          return sendBackendError(res, {
            code: BackendResponseStatusCode.NOT_FOUND,
            label: BackendErrorLabel.TRAVEL_COST_DOES_NOT_EXIST,
            message: error.message,
          });
        }
      }
      throw error;
    }
  }),
});
