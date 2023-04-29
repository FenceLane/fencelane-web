import { withApiAuth } from "../../../../../lib/server/middlewares/withApiAuth";
import { withApiMethods } from "../../../../../lib/server/middlewares/withApiMethods";
import { uploadFile } from "../../../../../lib/server/FileService/FileService";
import { withValidatedFormDataBody } from "../../../../../lib/server/middlewares/withValidatedFormDataBody";
import { BackendResponseStatusCode } from "../../../../../lib/server/BackendError/BackendError";

// we want to parse the form data body ourselves (withValidatedFormDataBody)
export const config = {
  api: {
    bodyParser: false,
  },
};

export default withApiMethods({
  POST: withApiAuth(
    withValidatedFormDataBody(async (req, res) => {
      const { orderId } = req.query;
      if (typeof orderId !== "string") {
        throw Error('"orderId" was not passed in dynamic api path.');
      }

      const uploadedFiles = await Promise.all(req.files.map(uploadFile));

      //@TODO: save uploadedFiles reference to database
      return res
        .status(BackendResponseStatusCode.SUCCESS)
        .send({ data: uploadedFiles });
    })
  ),

  //   GET: withApiAuth(async (req, res) => {
  //     const { orderId } = req.query;
  //     if (typeof orderId !== "string") {
  //       throw Error('"orderId" was not passed in dynamic api path.');
  //     }

  //     const orderExpanses = await prismaClient.productExpanse.findMany({
  //       where: { productOrder: { orderId: Number(orderId) } },
  //       select: {
  //         id: true,
  //         price: true,
  //         currency: true,
  //         type: true,
  //         productOrderId: true,
  //       },
  //     });

  //     return res
  //       .status(BackendResponseStatusCode.SUCCESS)
  //       .send({ data: orderExpanses });
  //   }),
});
