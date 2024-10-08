import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { prismaClient } from "../../../../../../lib/prisma/prismaClient";
import {
  BackendError,
  BackendErrorLabel,
  BackendResponseStatusCode,
  PrismaErrorCode,
  sendBackendError,
} from "../../../../../../lib/server/BackendError/BackendError";
import { withApiAuth } from "../../../../../../lib/server/middlewares/withApiAuth";
import { withApiMethods } from "../../../../../../lib/server/middlewares/withApiMethods";
import { deleteFile } from "../../../../../../lib/server/FileService/FileService";

export default withApiMethods({
  GET: withApiAuth(async (req, res) => {
    const { orderId, key } = req.query;

    if (typeof orderId !== "string") {
      throw Error('"orderId" was not passed in dynamic api path.');
    }
    if (typeof key !== "string") {
      throw Error('"key" was not passed in dynamic api path.');
    }

    const orderFile = await prismaClient.orderFile.findUnique({
      where: { key },
    });

    if (!orderFile) {
      return sendBackendError(res, {
        code: BackendResponseStatusCode.NOT_FOUND,
        label: BackendErrorLabel.EXPANSE_DOES_NOT_EXIST,
      });
    }

    return res
      .status(BackendResponseStatusCode.SUCCESS)
      .send({ data: orderFile });
  }),

  DELETE: withApiAuth(async (req, res) => {
    const { orderId, key } = req.query;
    if (typeof orderId !== "string") {
      throw Error('"orderId" was not passed in dynamic api path.');
    }
    if (typeof key !== "string") {
      throw Error('"key" was not passed in dynamic api path.');
    }

    try {
      return prismaClient.$transaction(async (tx) => {
        const deletedFile = await tx.orderFile.delete({
          where: { key },
        });

        try {
          // if file is not deleted properly form bucket, we want to rollback the transaction
          await deleteFile(key);
        } catch (error) {
          throw new BackendError({
            code: BackendResponseStatusCode.BAD_REQUEST,
            label: BackendErrorLabel.FILE_DELETE_ERROR,
          });
        }

        return res
          .status(BackendResponseStatusCode.SUCCESS)
          .send({ data: deletedFile });
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCode.RECORD_NOT_FOUND_OR_RESTRICTED) {
          return sendBackendError(res, {
            code: BackendResponseStatusCode.NOT_FOUND,
            label: BackendErrorLabel.ORDER_FILE_DOES_NOT_EXIST,
            message: error.message,
          });
        }
      }
      throw error;
    }
  }),
});
