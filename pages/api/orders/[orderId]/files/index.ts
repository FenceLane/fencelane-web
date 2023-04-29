
import { withApiAuth } from "../../../../../lib/server/middlewares/withApiAuth";
import { withApiMethods } from "../../../../../lib/server/middlewares/withApiMethods";
import formidable from "formidable";
import { NextApiRequest } from "next";
import {
  BackendErrorLabel,
  BackendResponseStatusCode,
  sendBackendError,
} from "../../../../../lib/server/BackendError/BackendError";

export const config = {
  api: {
    bodyParser: false,
  },
};

function formidablePromise(
  req: NextApiRequest,
  opts?: Parameters<typeof formidable>[0]
): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  return new Promise((accept, reject) => {
    const form = formidable(opts);

    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      return accept({ fields, files });
    });
  });
}

const formidableConfig = {
  maxFileSize: 500 * 1024 * 1024, // 500MB
  allowEmptyFiles: false,
};

export default withApiMethods({
  POST: withApiAuth(async (req, res) => {
    const { orderId } = req.query;
    if (typeof orderId !== "string") {
      throw Error('"orderId" was not passed in dynamic api path.');
    }

    const form = formidable(formidableConfig);
    form.parse(req, async function (err, fields, files) {
      if (err) {
        return sendBackendError(res, {
          code: BackendResponseStatusCode.BAD_REQUEST,
          label: BackendErrorLabel.INVALID_CREDENTIALS,
          message: err.message,
        });
      }

      for (const file of Object.values(files)) {
        console.log(file);
      }

      return res.status(201).send({ data: true });
    });
  }),

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
