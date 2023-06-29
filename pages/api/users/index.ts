import { prismaClient } from "../../../lib/prisma/prismaClient";
import { BackendResponseStatusCode } from "../../../lib/server/BackendError/BackendError";
import { withApiAuth } from "../../../lib/server/middlewares/withApiAuth";
import { withApiMethods } from "../../../lib/server/middlewares/withApiMethods";

export default withApiMethods({
  GET: withApiAuth(async (req, res) => {
    const users = await prismaClient.user.findMany({
      select: { id: true, email: true, name: true, role: true, phone: true },
    });
    return res.status(BackendResponseStatusCode.SUCCESS).send({ data: users });
  }),
});
