import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { BackendErrorLabel } from "../BackendError/BackendError";

export const getLabelFromPrismaError = (
  error: PrismaClientKnownRequestError
) => {
  const fieldName = error.meta?.field_name;
  if (!fieldName || typeof fieldName !== "string") {
    throw error;
  }

  if (fieldName.includes("productId")) {
    return BackendErrorLabel.PRODUCT_DOES_NOT_EXIST;
  }

  if (fieldName.includes("orderId")) {
    return BackendErrorLabel.ORDER_DOES_NOT_EXIST;
  }

  if (fieldName.includes("clientId")) {
    return BackendErrorLabel.CLIENT_DOES_NOT_EXIST;
  }

  if (fieldName.includes("destinationId")) {
    return BackendErrorLabel.DESTINATION_DOES_NOT_EXIST;
  }

  throw error;
};
