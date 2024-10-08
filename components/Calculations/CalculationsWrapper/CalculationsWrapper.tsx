import { Flex } from "@chakra-ui/react";
import { useContent } from "../../../lib/hooks/useContent";
import { mapAxiosErrorToLabel } from "../../../lib/server/BackendError/BackendError";
import { LoadingAnimation } from "../../LoadingAnimation/LoadingAnimation";
import { Calculations } from "../Calculations";
import { useGetOrders } from "../../../lib/api/hooks/orders";

export const CalculationsWrapper = () => {
  const { t } = useContent("errors.backendErrorLabel");

  const { isError, error, isLoading, data } = useGetOrders();

  if (isLoading)
    return (
      <Flex justifyContent="center" alignItems="center" height="100%">
        <LoadingAnimation />
      </Flex>
    );

  if (isError) return <p>{t(mapAxiosErrorToLabel(error))}</p>;

  return <Calculations orderData={data} />;
};
