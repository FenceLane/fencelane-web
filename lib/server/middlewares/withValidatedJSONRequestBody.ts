import { NextApiRequest, NextApiResponse } from "next";
import {
  BackendErrorLabel,
  BackendResponseStatusCode,
  sendBackendError,
} from "../BackendError/BackendError";
import { z } from "zod";
import { sendValidationBackendError } from "../BackendError/ValidationBackendError";
import { CONTENT_TYPE } from "../../types";

const isApplicationJson = (
  contentTypeHeader: string
): contentTypeHeader is CONTENT_TYPE.APPLICATION_JSON => {
  return contentTypeHeader === CONTENT_TYPE.APPLICATION_JSON;
};

interface NextApiRequestExtended<T> extends NextApiRequest {
  parsedBody: T;
}

export const withValidatedJSONRequestBody =
  <T>(schema: z.ZodSchema<T>) =>
  (
    handler: (
      req: NextApiRequestExtended<T>,
      res: NextApiResponse
    ) => Promise<void>
  ) =>
  async (req: NextApiRequestExtended<T>, res: NextApiResponse) => {
    const contentTypeHeader = req.headers["content-type"] as CONTENT_TYPE;
    if (contentTypeHeader && !isApplicationJson(contentTypeHeader)) {
      return sendBackendError(res, {
        code: BackendResponseStatusCode.BAD_REQUEST,
        label: BackendErrorLabel.INVALID_REQUEST_CONTENT_TYPE,
      });
    }

    try {
      req.parsedBody = schema.parse(req.body) as T;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return sendValidationBackendError(res, {
          code: BackendResponseStatusCode.UNPROCESSABLE_ENTITY,
          label: BackendErrorLabel.INVALID_REQUEST_BODY,
          fields: error.issues.flatMap((issue) => `${issue.path}`),
          message: error.name,
        });
      }
      return sendBackendError(res, {
        code: BackendResponseStatusCode.BAD_REQUEST,
        label: BackendErrorLabel.UNEXPECTED_ERROR,
      });
    }

    return await handler(req, res);
  };
