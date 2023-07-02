import React from "react";
import { Flex } from "@chakra-ui/react";
import { useGetOrder } from "../../../lib/api/hooks/orders";
import { useContent } from "../../../lib/hooks/useContent";
import { mapAxiosErrorToLabel } from "../../../lib/server/BackendError/BackendError";
import { LoadingAnimation } from "../../LoadingAnimation/LoadingAnimation";
import { OrderDetails } from "./OrderDetails/OrderDetails";
import {
  useGetOrderExpanses,
  useGetOrderTransportCost,
} from "../../../lib/api/hooks/calcs";

interface OrderDetailsWrapperProps {
  id: number;
}

export const OrderDetailsWrapper = ({ id }: OrderDetailsWrapperProps) => {
  const { t } = useContent("errors.backendErrorLabel");

  const {
    isError: isOrderError,
    error: orderError,
    isLoading: isOrderLoading,
    data: orderData,
  } = useGetOrder(id);

  const {
    isError: isTransportCostError,
    error: transportCostError,
    isLoading: isTransportCostLoading,
    data: transportCost,
  } = useGetOrderTransportCost(id);

  const {
    isError: isExpansesError,
    error: expansesError,
    isLoading: isExpansesLoading,
    data: expanses,
  } = useGetOrderExpanses(id);

  if (isExpansesLoading || isOrderLoading)
    return (
      <Flex justifyContent="center" alignItems="center" height="100%">
        <LoadingAnimation />
      </Flex>
    );

  if (
    ((isTransportCostError &&
      mapAxiosErrorToLabel(transportCostError) ===
        "travel-cost-does-not-exist") ||
      Object.keys(expanses).length === 0) &&
    !isOrderError
  ) {
    return (
      <OrderDetails
        expanses={null}
        transportCost={null}
        orderData={orderData}
      />
    );
  }
  if (isTransportCostError || isExpansesError || isOrderError) {
    return (
      <>
        {isTransportCostError && (
          <p>{t(mapAxiosErrorToLabel(transportCostError))}</p>
        )}
        {isExpansesError && <p>{t(mapAxiosErrorToLabel(expansesError))}</p>}
        {isOrderError && <p>{t(mapAxiosErrorToLabel(orderError))}</p>}
      </>
    );
  }
  return (
    <OrderDetails
      expanses={expanses}
      transportCost={transportCost}
      orderData={orderData}
    />
  );
};
