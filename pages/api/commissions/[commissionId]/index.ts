import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { prismaClient } from "../../../../lib/prisma/prismaClient";
import {
  BackendErrorLabel,
  BackendResponseStatusCode,
  PrismaErrorCode,
  sendBackendError,
} from "../../../../lib/server/BackendError/BackendError";
import { withApiAuth } from "../../../../lib/server/middlewares/withApiAuth";
import { withApiMethods } from "../../../../lib/server/middlewares/withApiMethods";
import { withValidatedJSONRequestBody } from "../../../../lib/server/middlewares/withValidatedJSONRequestBody";
import { CommissionDataUpdateSchema } from "../../../../lib/schema/commissionData";

export default withApiMethods({
  GET: withApiAuth(async (req, res) => {
    const { commissionId } = req.query;

    if (typeof commissionId !== "string") {
      throw Error('"commissionId" was not passed in dynamic api path.');
    }

    const commission = await prismaClient.commission.findUnique({
      where: { id: Number(commissionId) },
    });

    if (!commission) {
      return sendBackendError(res, {
        code: BackendResponseStatusCode.NOT_FOUND,
        label: BackendErrorLabel.COMMISSION_DOES_NOT_EXIST,
      });
    }

    return res
      .status(BackendResponseStatusCode.SUCCESS)
      .send({ data: commission });
  }),

  PUT: withApiAuth(
    withValidatedJSONRequestBody(CommissionDataUpdateSchema)(
      async (req, res) => {
        const { commissionId } = req.query;
        if (typeof commissionId !== "string") {
          throw Error('"commissionId" was not passed in dynamic api path.');
        }

        const commissionData = req.parsedBody;

        try {
          const updatedCommission = await prismaClient.commission.update({
            where: { id: Number(commissionId) },
            data: commissionData,
          });

          return res
            .status(BackendResponseStatusCode.SUCCESS)
            .send({ data: updatedCommission });
        } catch (error) {
          if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === PrismaErrorCode.RECORD_NOT_FOUND_OR_RESTRICTED) {
              return sendBackendError(res, {
                code: BackendResponseStatusCode.NOT_FOUND,
                label: BackendErrorLabel.COMMISSION_DOES_NOT_EXIST,
                message: error.message,
              });
            }
            if (error.code === PrismaErrorCode.FOREIGN_KEY_NOT_FOUND) {
              return sendBackendError(res, {
                code: BackendResponseStatusCode.NOT_FOUND,
                label: BackendErrorLabel.ORDER_DOES_NOT_EXIST,
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
    const { commissionId } = req.query;
    if (typeof commissionId !== "string") {
      throw Error('"commissionId" was not passed in dynamic api path.');
    }

    try {
      const deletedCommission = await prismaClient.commission.delete({
        where: { id: Number(commissionId) },
      });

      return res
        .status(BackendResponseStatusCode.SUCCESS)
        .send({ data: deletedCommission });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCode.RECORD_NOT_FOUND_OR_RESTRICTED) {
          return sendBackendError(res, {
            code: BackendResponseStatusCode.NOT_FOUND,
            label: BackendErrorLabel.COMMISSION_DOES_NOT_EXIST,
            message: error.message,
          });
        }
      }
      throw error;
    }
  }),
});
