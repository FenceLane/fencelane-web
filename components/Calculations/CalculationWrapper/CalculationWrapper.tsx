import { Flex } from "@chakra-ui/react";
import { useContent } from "../../../lib/hooks/useContent";
import { mapAxiosErrorToLabel } from "../../../lib/server/BackendError/BackendError";
import { LoadingAnimation } from "../../LoadingAnimation/LoadingAnimation";
import {
  useGetOrderTransportCost,
  useGetOrderExpanses,
  useGetEurRate,
} from "../../../lib/api/hooks/calcs";
import { Calculation } from "../Calculation/Calculation";
import { CalculationCreator } from "../CalculationCreator/CalculationCreator";
import { useGetOrder } from "../../../lib/api/hooks/orders";

interface CalculationWrapperProps {
  orderId: number;
  rateDate: string;
}

export const CalculationWrapper = ({
  orderId,
  rateDate,
}: CalculationWrapperProps) => {
  const { t } = useContent("errors.backendErrorLabel");

  const {
    isError: isOrdersError,
    error: ordersError,
    isLoading: isOrdersLoading,
    data: orderData,
  } = useGetOrder(orderId);

  const {
    isError: isTransportCostError,
    error: transportCostError,
    isLoading: isTransportCostLoading,
    data: transportCost,
  } = useGetOrderTransportCost(orderId);

  const {
    isError: isExpansesError,
    error: expansesError,
    isLoading: isExpansesLoading,
    data: expanses,
  } = useGetOrderExpanses(orderId);

  const {
    isError: isRateError,
    error: rateError,
    isLoading: isRateLoading,
    data: rate,
  } = useGetEurRate();

  if (isExpansesLoading || isOrdersLoading || isRateLoading)
    return (
      <Flex justifyContent="center" alignItems="center" height="100%">
        <LoadingAnimation></LoadingAnimation>
      </Flex>
    );

  if (
    ((isTransportCostError &&
      mapAxiosErrorToLabel(transportCostError) ===
        "travel-cost-does-not-exist") ||
      Object.keys(expanses).length === 0) &&
    !isOrdersError
  ) {
    return (
      <CalculationCreator orderId={orderId} orderData={orderData} rate={rate} />
    );
  }
  console.log(expanses);
  if (isTransportCostError || isExpansesError) {
    return (
      <p>
        `${t(mapAxiosErrorToLabel(transportCostError))} $
        {t(mapAxiosErrorToLabel(transportCostError))} `
      </p>
    );
  }
  return (
    <Calculation
      orderId={3}
      transportCost={transportCost}
      expanses={expanses}
    />
  );
};
