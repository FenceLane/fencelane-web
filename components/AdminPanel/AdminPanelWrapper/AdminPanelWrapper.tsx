import { Flex } from "@chakra-ui/react";
import { useContent } from "../../../lib/hooks/useContent";
import { mapAxiosErrorToLabel } from "../../../lib/server/BackendError/BackendError";
import { LoadingAnimation } from "../../LoadingAnimation/LoadingAnimation";
import { useGetRegisterToken } from "../../../lib/api/hooks/adminpanel";
import { AdminPanel } from "../AdminPanel";

export const AdminPanelWrapper = () => {
  const { t } = useContent("errors.backendErrorLabel");

  const { isError, error, isLoading, data } = useGetRegisterToken();

  if (isLoading)
    return (
      <Flex justifyContent="center" alignItems="center" height="100%">
        <LoadingAnimation />
      </Flex>
    );

  if (isError) return <p>{t(mapAxiosErrorToLabel(error))}</p>;

  return <AdminPanel registerToken={data} />;
};
