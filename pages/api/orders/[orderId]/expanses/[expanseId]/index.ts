import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { prismaClient } from "../../../../../../lib/prisma/prismaClient";
import { ProductOrderExpanseDataUpdateSchema } from "../../../../../../lib/schema/productOrderExpanseData";
import {
  BackendErrorLabel,
  BackendResponseStatusCode,
  PrismaErrorCode,
  sendBackendError,
} from "../../../../../../lib/server/BackendError/BackendError";
import { withApiAuth } from "../../../../../../lib/server/middlewares/withApiAuth";
import { withApiMethods } from "../../../../../../lib/server/middlewares/withApiMethods";
import { withValidatedJSONRequestBody } from "../../../../../../lib/server/middlewares/withValidatedJSONRequestBody";

export default withApiMethods({
  GET: withApiAuth(async (req, res) => {
    const { orderId, expanseId } = req.query;

    if (typeof orderId !== "string") {
      throw Error('"orderId" was not passed in dynamic api path.');
    }
    if (typeof expanseId !== "string") {
      throw Error('"expanseId" was not passed in dynamic api path.');
    }

    const expanse = await prismaClient.productExpanse.findUnique({
      where: { id: expanseId },
      select: {
        id: true,
        price: true,
        currency: true,
        type: true,
        productOrderId: true,
      },
    });

    if (!expanse) {
      return sendBackendError(res, {
        code: BackendResponseStatusCode.NOT_FOUND,
        label: BackendErrorLabel.EXPANSE_DOES_NOT_EXIST,
      });
    }

    return res
      .status(BackendResponseStatusCode.SUCCESS)
      .send({ data: expanse });
  }),

  PUT: withApiAuth(
    withValidatedJSONRequestBody(ProductOrderExpanseDataUpdateSchema)(
      async (req, res) => {
        const { orderId, expanseId } = req.query;
        if (typeof orderId !== "string") {
          throw Error('"orderId" was not passed in dynamic api path.');
        }
        if (typeof expanseId !== "string") {
          throw Error('"expanseId" was not passed in dynamic api path.');
        }

        const expanseData = req.parsedBody;

        try {
          const updatedExpanse = await prismaClient.productExpanse.update({
            where: { id: expanseId },
            data: expanseData,
          });

          return res
            .status(BackendResponseStatusCode.SUCCESS)
            .send({ data: updatedExpanse });
        } catch (error) {
          if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === PrismaErrorCode.RECORD_NOT_FOUND_OR_RESTRICTED) {
              return sendBackendError(res, {
                code: BackendResponseStatusCode.NOT_FOUND,
                label: BackendErrorLabel.EXPANSE_DOES_NOT_EXIST,
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
    const { orderId, expanseId } = req.query;
    if (typeof orderId !== "string") {
      throw Error('"orderId" was not passed in dynamic api path.');
    }
    if (typeof expanseId !== "string") {
      throw Error('"expanseId" was not passed in dynamic api path.');
    }

    try {
      const deletedExpanse = await prismaClient.productExpanse.delete({
        where: { id: expanseId },
      });

      return res
        .status(BackendResponseStatusCode.SUCCESS)
        .send({ data: deletedExpanse });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCode.RECORD_NOT_FOUND_OR_RESTRICTED) {
          return sendBackendError(res, {
            code: BackendResponseStatusCode.NOT_FOUND,
            label: BackendErrorLabel.EXPANSE_DOES_NOT_EXIST,
            message: error.message,
          });
        }
      }
      throw error;
    }
  }),
});
