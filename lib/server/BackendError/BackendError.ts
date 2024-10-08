import axios from "axios";
import { NextApiResponse } from "next";

export const BackendErrorLabel = {
  USER_DOES_NOT_EXIST: "user-does-not-exist",
  USER_ALREADY_EXISTS: "user-already-exists",
  INVALID_REGISTER_TOKEN: "invalid-register-token",
  INVALID_REQUEST_CONTENT_TYPE: "invalid-request-content-type",
  INVALID_REQUEST_BODY: "invalid-request-body",
  UNEXPECTED_ERROR: "unexpected-error",
  METHOD_NOT_ALLOWED: "method-not-allowed",
  FORBIDDEN_ADMIN_ONLY: "forbidden-admin-only",
  INVALID_CREDENTIALS: "invalid-credentials",
  INVALID_PASSWORD_RESET_TOKEN: "invalid-password-reset-token",
  PRODUCT_ALREADY_EXISTS: "product-already-exists",
  PRODUCT_CATEGORY_ALREADY_EXISTS: "product-category-already-exists",
  CLIENT_ALREADY_EXISTS: "client-already-exists",
  DESTINATION_ALREADY_EXISTS: "destination-already-exists",
  DESTINATION_DOES_NOT_EXIST: "destination-does-not-exist",
  UNAUTHORIZED: "unauthorized",
  COMMISSION_DOES_NOT_EXIST: "commission-does-not-exist",
  ORDER_DOES_NOT_EXIST: "order-does-not-exist",
  EVENT_DOES_NOT_EXIST: "event-does-not-exist",
  TRAVEL_COST_ALREADY_EXISTS: "travel-cost-already-exists",
  TRAVEL_COST_DOES_NOT_EXIST: "travel-cost-does-not-exist",
  EXPANSE_DOES_NOT_EXIST: "expanse-does-not-exist",
  PRODUCT_ORDER_DOES_NOT_EXIST: "product-order-does-not-exist",
  PRODUCT_COMMISSION_DOES_NOT_EXIST: "product-commission-does-not-exist",
  QUANTITY_EXCEEDS_PRODUCT_COMMISSION_QUANTITY:
    "quantity-exceeds-product-commission-quantity",
  PRODUCT_DOES_NOT_EXIST: "product-does-not-exist",
  PRODUCT_CATEGORY_DOES_NOT_EXIST: "product-category-does-not-exist",
  CANNOT_DELETE_PRODUCT_WITH_ORDERS: "cannot-delete-product-with-orders",
  CANNOT_DELETE_PRODUCT_CATEGORY_WITH_PRODUCTS:
    "cannot-delete-product-category-with-products",
  CLIENT_DOES_NOT_EXIST: "client-does-not-exist",
  FILE_UPLOAD_ERROR: "file-upload-error",
  FILE_DELETE_ERROR: "file-delete-error",
  ORDER_FILE_DOES_NOT_EXIST: "order-file-does-not-exist",
} as const;

export const PrismaErrorCode = {
  UNIQUE_CONSTRAINT_FAILED: "P2002",
  FOREIGN_KEY_NOT_FOUND: "P2003",
  RECORD_NOT_FOUND_OR_RESTRICTED: "P2025",
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

export const mapAxiosErrorToLabel = (error: unknown) => {
  if (!axios.isAxiosError(error)) {
    return BackendErrorLabel.UNEXPECTED_ERROR;
  }

  return error.response?.data.label || BackendErrorLabel.UNEXPECTED_ERROR;
};
