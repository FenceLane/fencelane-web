import { Flex } from "@chakra-ui/react";
import { useContent } from "../../../../../lib/hooks/useContent";
import { useGetClients } from "../../../../../lib/api/hooks/orders";
import { LoadingAnimation } from "../../../../LoadingAnimation/LoadingAnimation";
import { mapAxiosErrorToLabel } from "../../../../../lib/server/BackendError/BackendError";
import { DestinationCreate } from "./DestinationCreate/DestinationCreate";

export const DestinationCreateWrapper = () => {
  const { t } = useContent("errors.backendErrorLabel");

  const {
    isError: isClientsError,
    error: clientsError,
    isLoading: isClientsLoading,
    data: clients,
  } = useGetClients();

  if (isClientsLoading)
    return (
      <Flex justifyContent="center" alignItems="center" height="100%">
        <LoadingAnimation />
      </Flex>
    );

  if (isClientsError)
    return <p>{isClientsError && t(mapAxiosErrorToLabel(clientsError))}</p>;

  return <DestinationCreate clients={clients.data} />;
};
