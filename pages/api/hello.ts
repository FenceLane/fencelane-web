// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { withApiAuth } from "../../lib/server/middlewares/withApiAuth";
import { withApiMethods } from "../../lib/server/middlewares/withApiMethods";

type Data = {
  name: string;
};

export default withApiMethods({
  GET: withApiAuth(async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    res.status(200).json({ name: "John Doe" });
  }),
});
