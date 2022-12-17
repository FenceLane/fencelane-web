import type { NextApiRequest, NextApiResponse } from "next";
import {
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
  async (req: R, res: NextApiResponse) => {
    const method = req.method as HTTPMethods;
    const handler = handlers[method] || handlers.default;

    if (handler) {
      try {
        return await handler(req, res);
      } catch (error) {
        sendBackendError(res, {
          code: BackendResponseStatusCode.BAD_REQUEST,
          label: BackendErrorLabel.UNEXPECTED_ERROR,
        });
      }
    }

    return sendBackendError(res, {
      code: BackendResponseStatusCode.METHOD_NOT_ALLOWED,
      label: BackendErrorLabel.METHOD_NOT_ALLOWED,
    });
  };
