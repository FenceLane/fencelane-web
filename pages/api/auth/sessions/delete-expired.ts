import { prisma } from "../../../../lib/prisma/client";
import { BackendResponseStatusCode } from "../../../../lib/server/BackendError/BackendError";
import { withApiMethods } from "../../../../lib/server/middlewares/withApiMethods";

export default withApiMethods({
  DELETE: async (req, res) => {
    const now = new Date();

    const deleted = await prisma.session.deleteMany({
      where: { expiresAt: { lt: now } },
    });

    return res
      .status(BackendResponseStatusCode.SUCCESS)
      .send({ data: { deleted: deleted.count } });
  },
});
