import { prismaClient } from "../../../../../lib/prisma/prismaClient";
import { BackendResponseStatusCode } from "../../../../../lib/server/BackendError/BackendError";
import { withApiAuth } from "../../../../../lib/server/middlewares/withApiAuth";
import { withApiMethods } from "../../../../../lib/server/middlewares/withApiMethods";

export default withApiMethods({
  GET: withApiAuth(async (req, res) => {
    const { orderId } = req.query;
    if (typeof orderId !== "string") {
      throw Error('"orderId" was not passed in dynamic api path.');
    }

    const stocks = await prismaClient.commodityStock.findMany({
      where: { orderId },
    });

    return res.status(BackendResponseStatusCode.SUCCESS).send({ data: stocks });
  }),
});
