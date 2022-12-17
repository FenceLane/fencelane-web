import { deleteCookieSession } from "../../../lib/server/cookieSessionUtils";
import { BackendResponseStatusCode } from "../../../lib/server/BackendError/BackendError";
import { withApiMethods } from "../../../lib/server/middlewares/withApiMethods";

export default withApiMethods({
  DELETE: async (req, res) => {
    await deleteCookieSession(req, res);
    return res.status(BackendResponseStatusCode.SUCCESS).send({ data: true });
  },
});
