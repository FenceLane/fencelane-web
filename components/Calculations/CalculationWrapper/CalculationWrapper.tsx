import { Flex } from "@chakra-ui/react";
import { useContent } from "../../../lib/hooks/useContent";
import {
  BackendErrorLabel,
  mapAxiosErrorToLabel,
} from "../../../lib/server/BackendError/BackendError";
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
  loadId: number;
}

export const CalculationWrapper = ({ loadId }: CalculationWrapperProps) => {
  const { t } = useContent("errors.backendErrorLabel");

  const {
    isError: isLoadsError,
    error: loadsError,
    isLoading: isLoadsLoading,
    data: loadData,
  } = useGetOrder(loadId);

  const {
    isError: isTransportCostError,
    error: transportCostError,
    isLoading: isTransportCostLoading,
    data: transportCost,
  } = useGetOrderTransportCost(loadId);

  const {
    isError: isExpansesError,
    error: expansesError,
    isLoading: isExpansesLoading,
    data: expanses,
  } = useGetOrderExpanses(loadId);

  const {
    isError: isRateError,
    error: rateError,
    isLoading: isRateLoading,
    data: rate,
  } = useGetEurRate();

  if (isExpansesLoading || isLoadsLoading || isRateLoading)
    return (
      <Flex justifyContent="center" alignItems="center" height="100%">
        <LoadingAnimation></LoadingAnimation>
      </Flex>
    );

  if (
    ((isTransportCostError &&
      mapAxiosErrorToLabel(transportCostError) ===
        BackendErrorLabel.TRAVEL_COST_DOES_NOT_EXIST) ||
      Object.keys(expanses).length === 0) &&
    !isLoadsError
  ) {
    return (
      <CalculationCreator loadId={loadId} loadData={loadData} rate={rate} />
    );
  }
  if (isTransportCostError || isExpansesError) {
    return (
      <>
        <p>{t(mapAxiosErrorToLabel(transportCostError))}</p>
        <p>{t(mapAxiosErrorToLabel(expansesError))}</p>
      </>
    );
  }
  return (
    <Calculation
      loadId={loadId}
      transportCost={transportCost}
      expanses={expanses}
      rate={rate}
    />
  );
};
