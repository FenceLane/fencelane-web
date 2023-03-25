import React from "react";
import { Flex } from "@chakra-ui/react";
import { useGetOrder } from "../../../lib/api/hooks/orders";
import { useContent } from "../../../lib/hooks/useContent";
import { mapAxiosErrorToLabel } from "../../../lib/server/BackendError/BackendError";
import { LoadingAnimation } from "../../LoadingAnimation/LoadingAnimation";
import { OrderDetails } from "./OrderDetails/OrderDetails";

interface OrderDetailsWrapperProps {
  id: number;
}

export const OrderDetailsWrapper = ({ id }: OrderDetailsWrapperProps) => {
  const { t } = useContent("errors.backendErrorLabel");
  const { isError, error, isLoading, data } = useGetOrder(id);

  if (isLoading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100%">
        <LoadingAnimation />
      </Flex>
    );
  }

  if (isError) {
    return <p>{t(mapAxiosErrorToLabel(error))}</p>;
  }
  return <OrderDetails orderData={data} />;
};
