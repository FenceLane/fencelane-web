import { withApiAuth } from "../../../../../lib/server/middlewares/withApiAuth";
import { withApiMethods } from "../../../../../lib/server/middlewares/withApiMethods";
import { uploadFile } from "../../../../../lib/server/FileService/FileService";
import { withValidatedFormDataBody } from "../../../../../lib/server/middlewares/withValidatedFormDataBody";
import {
  BackendErrorLabel,
  BackendResponseStatusCode,
  sendBackendError,
} from "../../../../../lib/server/BackendError/BackendError";
import { prismaClient } from "../../../../../lib/prisma/prismaClient";
import { PrismaErrorCode } from "../../../../../lib/server/BackendError/BackendError";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

// we want to parse the form data body ourselves (withValidatedFormDataBody)
export const config = {
  api: {
    bodyParser: false,
  },
};

export default withApiMethods({
  POST: withApiAuth(
    withValidatedFormDataBody(async (req, res) => {
      const { orderId } = req.query;
      if (typeof orderId !== "string") {
        throw Error('"orderId" was not passed in dynamic api path.');
      }

      try {
        const uploadedFiles = await Promise.all(
          req.formData.files.map((file) => uploadFile(file))
        );

        await prismaClient.orderFile.createMany({
          data: uploadedFiles.map((file) => ({
            orderId: Number(orderId),
            key: file.Key,
            url: file.Location,
          })),
          skipDuplicates: true, //if file already exists (based on key field), skip it
        });

        const responseData = uploadedFiles.map((file) => ({
          key: file.Key,
          url: file.Location,
        }));

        return res
          .status(BackendResponseStatusCode.SUCCESS)
          .send({ data: responseData });
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === PrismaErrorCode.FOREIGN_KEY_NOT_FOUND) {
            return sendBackendError(res, {
              code: BackendResponseStatusCode.NOT_FOUND,
              label: BackendErrorLabel.ORDER_DOES_NOT_EXIST,
              message: error.message,
            });
          }
        }

        return sendBackendError(res, {
          code: BackendResponseStatusCode.BAD_REQUEST,
          label: BackendErrorLabel.FILE_UPLOAD_ERROR,
        });
      }
    })
  ),

  GET: withApiAuth(async (req, res) => {
    const { orderId } = req.query;
    if (typeof orderId !== "string") {
      throw Error('"orderId" was not passed in dynamic api path.');
    }

    const orderFiles = await prismaClient.orderFile.findMany({
      where: { orderId: Number(orderId) },
    });

    return res
      .status(BackendResponseStatusCode.SUCCESS)
      .send({ data: orderFiles });
  }),
});
