import { prismaClient } from "../../../../../lib/prisma/prismaClient";
import { BackendResponseStatusCode } from "../../../../../lib/server/BackendError/BackendError";
import { withApiAuth } from "../../../../../lib/server/middlewares/withApiAuth";
import { withApiMethods } from "../../../../../lib/server/middlewares/withApiMethods";

export default withApiMethods({
  GET: withApiAuth(async (req, res) => {
    const { storageId } = req.query;
    if (typeof storageId !== "string") {
      throw Error('"storageId" was not passed in dynamic api path.');
    }

    const stocks = await prismaClient.commodityStock.findMany({
      where: { storageId },
    });

    return res.status(BackendResponseStatusCode.SUCCESS).send({ data: stocks });
  }),
});
