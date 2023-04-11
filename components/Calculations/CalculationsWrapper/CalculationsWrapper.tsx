// import { Flex } from "@chakra-ui/react";
// import { useGetCalculations } from "../../../lib/api/hooks/calculations";
import { useContent } from "../../../lib/hooks/useContent";
// import { mapAxiosErrorToLabel } from "../../../lib/server/BackendError/BackendError";
// import { LoadingAnimation } from "../../LoadingAnimation/LoadingAnimation";
import { Calculations } from "../Calculations";

export const CalculationsWrapper = () => {
  const { t } = useContent("errors.backendErrorLabel");

  //   const { isError, error, isLoading, data } = useGetCalculations();

  //   if (isLoading)
  //     return (
  //       <Flex justifyContent="center" alignItems="center" height="100%">
  //         <LoadingAnimation></LoadingAnimation>
  //       </Flex>
  //     );

  //   if (isError) return <p>{t(mapAxiosErrorToLabel(error))}</p>;

  return <Calculations />;
};
