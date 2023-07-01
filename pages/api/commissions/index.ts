import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { prismaClient } from "../../../lib/prisma/prismaClient";
import {
  BackendResponseStatusCode,
  PrismaErrorCode,
  sendBackendError,
} from "../../../lib/server/BackendError/BackendError";
import { withApiAuth } from "../../../lib/server/middlewares/withApiAuth";
import { withApiMethods } from "../../../lib/server/middlewares/withApiMethods";
import { withValidatedJSONRequestBody } from "../../../lib/server/middlewares/withValidatedJSONRequestBody";
import { CommissionDataCreateSchema } from "../../../lib/schema/commissionData";
import { getLabelFromPrismaError } from "../../../lib/server/utils/getLabelFromPrismaError";

export default withApiMethods({
  POST: withApiAuth(
    withValidatedJSONRequestBody(CommissionDataCreateSchema)(
      async (req, res) => {
        const { products: requestedProducts, ...commissionData } =
          req.parsedBody;

        try {
          const createdCommission = await prismaClient.commission.create({
            data: {
              ...commissionData,
              products: { createMany: { data: requestedProducts } },
            },
          });

          return res
            .status(BackendResponseStatusCode.SUCCESS)
            .send({ data: createdCommission });
        } catch (error) {
          if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === PrismaErrorCode.FOREIGN_KEY_NOT_FOUND) {
              const label = getLabelFromPrismaError(error);
              return sendBackendError(res, {
                code: BackendResponseStatusCode.NOT_FOUND,
                label,
                message: error.message,
              });
            }
          }
          throw error;
        }
      }
    )
  ),

  GET: withApiAuth(async (req, res) => {
    const commissions = await prismaClient.commission.findMany({
      include: {
        products: { include: { product: { include: { category: true } } } },
        order: true,
      },
    });

    return res
      .status(BackendResponseStatusCode.SUCCESS)
      .send({ data: commissions });
  }),
});
