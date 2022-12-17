import { NextApiResponse } from "next";

export const BackendErrorLabel = {
  USER_ALREADY_EXISTS: "user-already-exists",
  INVALID_REQUEST_CONTENT_TYPE: "invalid-request-content-type",
  INVALID_REQUEST_BODY: "invalid-request-body",
  UNEXPECTED_ERROR: "unexpected-error",
  METHOD_NOT_ALLOWED: "method-not-allowed",
  INVALID_CREDENTIALS: "invalid-credentials",
  UNAUTHORIZED: "unauthorized",
} as const;

export const BackendResponseStatusCode = {
  SUCCESS: 200,
  BAD_REQUEST: 400, //e.g. body was not included or body was of incorrect content type
  UNAUTHORIZED: 401, //e.g. user is not logged in / bad credentials
  FORBIDDEN: 403, //e.g. user with given role does not have permission to access a resource
  NOT_FOUND: 404, //e.g. page does not exist
  METHOD_NOT_ALLOWED: 405, //e.g. requested http method is not defined for this endpoint
  CONFLICT: 409, //e.g. user want to add a resource that already exists
  UNPROCESSABLE_ENTITY: 422, //e.g. validation error
} as const;

export class BackendError extends Error {
  public code: number;
  public label: string;

  constructor(params: { code: number; label: string; message?: string }) {
    super();
    this.stack = new Error().stack;
    this.code = params.code;
    this.label = params.label;
    if (params.message) {
      this.message = params.message;
    }
  }
}

export const sendBackendError = (
  response: NextApiResponse,
  error: { code: number; label: string; message?: string }
) => {
  response.status(error.code);
  return response.send(new BackendError(error));
};
