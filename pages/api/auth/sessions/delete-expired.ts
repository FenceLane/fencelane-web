import { prismaClient } from "../../../../lib/prisma/prismaClient";
import { BackendResponseStatusCode } from "../../../../lib/server/BackendError/BackendError";
import { withApiMethods } from "../../../../lib/server/middlewares/withApiMethods";

export default withApiMethods({
  DELETE: async (_req, res) => {
    const now = new Date();

    const deleted = await prismaClient.session.deleteMany({
      where: { expiresAt: { lt: now } },
    });

    return res
      .status(BackendResponseStatusCode.SUCCESS)
      .send({ data: { deleted: deleted.count } });
  },
});
