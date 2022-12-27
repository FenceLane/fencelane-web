import { BackendResponseStatusCode } from "../../../lib/server/BackendError/BackendError";
import { withApiMethods } from "../../../lib/server/middlewares/withApiMethods";
import { withApiAuth } from "../../../lib/server/middlewares/withApiAuth";
import { prismaClient } from "../../../lib/prisma/prismaClient";

export default withApiMethods({
  DELETE: withApiAuth(async (req, res) => {
    const { id } = req.session.user;
    await prismaClient.user.delete({ where: { id } });
    return res.status(BackendResponseStatusCode.SUCCESS).send({ data: true });
  }),
});
