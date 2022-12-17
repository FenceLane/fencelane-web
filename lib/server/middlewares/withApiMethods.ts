import type { NextApiRequest, NextApiResponse } from "next";
import {
  BackendError,
  BackendErrorLabel,
  BackendResponseStatusCode,
  sendBackendError,
} from "../BackendError/BackendError";

type HTTPMethods =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "HEAD"
  | "OPTIONS";

export const withApiMethods =
  <R extends NextApiRequest>(
    handlers: Partial<
      Record<HTTPMethods | "default", (req: R, res: NextApiResponse) => unknown>
    >
  ) =>
  (req: R, res: NextApiResponse) => {
    const method = req.method as HTTPMethods;
    const handler = handlers[method] || handlers.default;

    if (handler) {
      return handler(req, res);
    }

    return sendBackendError(
      res,
      new BackendError({
        code: BackendResponseStatusCode.METHOD_NOT_ALLOWED,
        label: BackendErrorLabel.METHOD_NOT_ALLOWED,
      })
    );
  };
