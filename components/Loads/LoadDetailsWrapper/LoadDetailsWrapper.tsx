import React from "react";
import { Flex } from "@chakra-ui/react";
import { useGetOrder } from "../../../lib/api/hooks/orders";
import { useContent } from "../../../lib/hooks/useContent";
import { mapAxiosErrorToLabel } from "../../../lib/server/BackendError/BackendError";
import { LoadingAnimation } from "../../LoadingAnimation/LoadingAnimation";
import { LoadDetails } from "./LoadDetails/LoadDetails";
import {
  useGetOrderExpanses,
  useGetOrderTransportCost,
} from "../../../lib/api/hooks/calcs";

interface LoadDetailsWrapperProps {
  id: number;
}

export const LoadDetailsWrapper = ({ id }: LoadDetailsWrapperProps) => {
  const { t } = useContent("errors.backendErrorLabel");

  const {
    isError: isLoadError,
    error: loadError,
    isLoading: isLoadLoading,
    data: loadData,
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

  if (isExpansesLoading || isLoadLoading)
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
    !isLoadError
  ) {
    return (
      <LoadDetails expanses={null} transportCost={null} loadData={loadData} />
    );
  }
  if (isTransportCostError || isExpansesError || isLoadError) {
    return (
      <>
        {isTransportCostError && (
          <p>{t(mapAxiosErrorToLabel(transportCostError))}</p>
        )}
        {isExpansesError && <p>{t(mapAxiosErrorToLabel(expansesError))}</p>}
        {isLoadError && <p>{t(mapAxiosErrorToLabel(loadError))}</p>}
      </>
    );
  }
  return (
    <LoadDetails
      expanses={expanses}
      transportCost={transportCost}
      loadData={loadData}
    />
  );
};
