import { BackendResponseStatusCode } from "../../../lib/server/BackendError/BackendError";
import { withApiMethods } from "../../../lib/server/middlewares/withApiMethods";
import { withApiAuth } from "../../../lib/server/middlewares/withApiAuth";

export default withApiMethods({
  GET: withApiAuth(async (req, res) => {
    const { password: _, ...userResponse } = req.session.user;
    return res
      .status(BackendResponseStatusCode.SUCCESS)
      .send({ data: userResponse });
  }),
});
