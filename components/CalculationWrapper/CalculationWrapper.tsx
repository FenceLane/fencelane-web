import { Flex } from "@chakra-ui/react";
import { useContent } from "../../lib/hooks/useContent";
import { mapAxiosErrorToLabel } from "../../lib/server/BackendError/BackendError";
import { LoadingAnimation } from "../LoadingAnimation/LoadingAnimation";
import {
  useGetOrderTransportCost,
  useGetOrderExpanses,
} from "../../lib/api/hooks/calcs";
import { Calculation } from "../Calculations/Calculation/Calculation";
import { CalculationCreator } from "../Calculations/CalculationCreator/CalculationCreator";

interface CalculationWrapperProps {
  orderId: number;
}

export const CalculationWrapper = ({ orderId }: CalculationWrapperProps) => {
  const { t } = useContent("errors.backendErrorLabel");

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

  if (isTransportCostLoading || isExpansesLoading)
    return (
      <Flex justifyContent="center" alignItems="center" height="100%">
        <LoadingAnimation></LoadingAnimation>
      </Flex>
    );

  if (
    (isTransportCostError &&
      mapAxiosErrorToLabel(transportCostError) ===
        "travel-cost-does-not-exist") ||
    Object.keys(expanses).length === 0
  ) {
    return <CalculationCreator orderId={orderId} />;
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
