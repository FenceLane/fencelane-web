import { prismaClient } from "../../../lib/prisma/prismaClient";
import { OrderDataSchema } from "../../../lib/schema/orderData";
import { BackendResponseStatusCode } from "../../../lib/server/BackendError/BackendError";
import { withApiAuth } from "../../../lib/server/middlewares/withApiAuth";
import { withApiMethods } from "../../../lib/server/middlewares/withApiMethods";
import { withValidatedJSONRequestBody } from "../../../lib/server/middlewares/withValidatedJSONRequestBody";

export default withApiMethods({
  POST: withApiAuth(
    withValidatedJSONRequestBody(OrderDataSchema)(async (req, res) => {
      const { stocks, ...orderData } = req.parsedBody;

      const createdOrder = await prismaClient.order.create({
        data: { ...orderData, stocks: { createMany: { data: stocks } } },
      });

      return res
        .status(BackendResponseStatusCode.SUCCESS)
        .send({ data: createdOrder });
    })
  ),

  GET: withApiAuth(async (_req, res) => {
    const orders = await prismaClient.order.findMany({
      select: { client: true, destination: true },
    });

    return res.status(BackendResponseStatusCode.SUCCESS).send({ data: orders });
  }),
});
