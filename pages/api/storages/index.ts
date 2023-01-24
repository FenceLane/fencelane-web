import { prismaClient } from "../../../lib/prisma/prismaClient";
import { StorageDataSchema } from "../../../lib/schema/storageData";
import { BackendResponseStatusCode } from "../../../lib/server/BackendError/BackendError";
import { withApiAuth } from "../../../lib/server/middlewares/withApiAuth";
import { withApiMethods } from "../../../lib/server/middlewares/withApiMethods";
import { withValidatedJSONRequestBody } from "../../../lib/server/middlewares/withValidatedJSONRequestBody";

export default withApiMethods({
  GET: withApiAuth(async (_req, res) => {
    const storages = await prismaClient.storage.findMany({
      include: { stocks: true },
    });

    return res
      .status(BackendResponseStatusCode.SUCCESS)
      .send({ data: storages });
  }),

  POST: withApiAuth(
    withValidatedJSONRequestBody(StorageDataSchema)(async (req, res) => {
      const { stocks } = req.parsedBody;

      const createdStorage = await prismaClient.storage.create({
        data: { stocks: { createMany: { data: stocks } } },
      });

      return res
        .status(BackendResponseStatusCode.SUCCESS)
        .send({ data: createdStorage });
    })
  ),
});
