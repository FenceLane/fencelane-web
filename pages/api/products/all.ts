import { prismaClient } from "../../../lib/prisma/prismaClient";
import { BackendResponseStatusCode } from "../../../lib/server/BackendError/BackendError";
import { withApiAuth } from "../../../lib/server/middlewares/withApiAuth";
import { withApiMethods } from "../../../lib/server/middlewares/withApiMethods";

export default withApiMethods({
  GET: withApiAuth(async (_req, res) => {
    const products = await prismaClient.productCategory.findMany({
      include: { products: true },
    });

    return res
      .status(BackendResponseStatusCode.SUCCESS)
      .send({ data: products });
  }),
});
