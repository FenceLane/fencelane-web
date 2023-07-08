import React from "react";
import { ParentOrders } from "../ParentOrders";
import { useGetOrdersByParentOrderId } from "../../../lib/api/hooks/orders";
import { Flex } from "@chakra-ui/react";
import { LoadingAnimation } from "../../LoadingAnimation/LoadingAnimation";
import { mapAxiosErrorToLabel } from "../../../lib/server/BackendError/BackendError";
import { useContent } from "../../../lib/hooks/useContent";

export default function ParentOrdersWrapper() {
  const { t } = useContent("errors.backendErrorLabel");

  const { isError, error, isLoading, data } = useGetOrdersByParentOrderId();

  if (isLoading)
    return (
      <Flex justifyContent="center" alignItems="center" height="100%">
        <LoadingAnimation />
      </Flex>
    );

  if (isError) return <p>{t(mapAxiosErrorToLabel(error))}</p>;

  return <ParentOrders ordersData={data} />;
}
