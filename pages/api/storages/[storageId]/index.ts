import { prismaClient } from "../../../../lib/prisma/prismaClient";
import {
  BackendErrorLabel,
  BackendResponseStatusCode,
  sendBackendError,
} from "../../../../lib/server/BackendError/BackendError";
import { withApiAuth } from "../../../../lib/server/middlewares/withApiAuth";
import { withApiMethods } from "../../../../lib/server/middlewares/withApiMethods";

export default withApiMethods({
  GET: withApiAuth(async (req, res) => {
    const { storageId } = req.query;
    if (typeof storageId !== "string") {
      throw Error('"storageId" was not passed in dynamic api path.');
    }

    const storage = await prismaClient.storage.findUnique({
      where: { id: storageId },
      include: { stocks: true },
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
