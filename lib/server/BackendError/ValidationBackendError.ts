import { NextApiResponse } from "next";
import { BackendError } from "./BackendError";

export class ValidationBackendError extends BackendError {
  fields: string[];
  constructor(params: {
    code: number;
    label: string;
    message?: string;
    fields: string[];
  }) {
    super(params);
    this.fields = params.fields;
  }
}

export const sendValidationBackendError = (
  response: NextApiResponse,
  error: { code: number; label: string; fields: string[]; message?: string }
) => {
  response.status(error.code);
  return response.send(new ValidationBackendError(error));
};
