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
