import { NextApiResponse } from "next";

export enum BackendErrorLabel {
  USER_ALREADY_EXISTS = "user-already-exists",
  INVALID_REQUEST_CONTENT_TYPE = "invalid-request-content-type",
  INVALID_REQUEST_BODY = "invalid-request-body",
  UNEXPECTED_ERROR = "unexpected-error",
}

export class BackendError extends Error {
  public code: number;
  public label: string;

  constructor(params: { code: number; label: string; message?: string }) {
    super();
    this.name = this.name;
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
  error: BackendError
) => {
  response.status(error.code);
  return response.send(error);
};
