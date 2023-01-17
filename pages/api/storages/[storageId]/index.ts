import { prismaClient } from "../../../../lib/prisma/prismaClient";
import { StorageDataSchema } from "../../../../lib/schema/storageData";
import {
  BackendErrorLabel,
  BackendResponseStatusCode,
  sendBackendError,
} from "../../../../lib/server/BackendError/BackendError";
import { withApiAuth } from "../../../../lib/server/middlewares/withApiAuth";
import { withApiMethods } from "../../../../lib/server/middlewares/withApiMethods";
import { withValidatedJSONRequestBody } from "../../../../lib/server/middlewares/withValidatedJSONRequestBody";

export default withApiMethods({
  POST: withApiAuth(
    withValidatedJSONRequestBody(StorageDataSchema)(async (req, res) => {
      const { stocks } = req.parsedBody;

      const createdCommodity = await prismaClient.storage.create({
        data: { stocks: { createMany: { data: stocks } } },
      });

      return res
        .status(BackendResponseStatusCode.SUCCESS)
        .send({ data: createdCommodity });
    })
  ),

  GET: withApiAuth(async (req, res) => {
    const { storageId } = req.query;
    if (typeof storageId !== "string") {
      throw Error('"storageId" was not passed in dynamic api path.');
    }

    const storage = await prismaClient.storage.findUnique({
      where: { id: storageId },
    });

    if (!storage) {
      return sendBackendError(res, {
        code: BackendResponseStatusCode.NOT_FOUND,
        label: BackendErrorLabel.STORAGE_DOES_NOT_EXIST,
      });
    }

    return res
      .status(BackendResponseStatusCode.SUCCESS)
      .send({ data: storage });
  }),
});
