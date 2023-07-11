import React from "react";
import { RegisterTokenInfo } from "../../lib/types";
import {
  useDeleteRegisterToken,
  usePostRegisterToken,
} from "../../lib/api/hooks/adminpanel";
import { Flex, Text, Button } from "@chakra-ui/react";
import { mapAxiosErrorToLabel } from "../../lib/server/BackendError/BackendError";
import { useContent } from "../../lib/hooks/useContent";
import moment from "moment";
interface AdminPanelProps {
  registerToken: RegisterTokenInfo;
}
export const AdminPanel = ({ registerToken }: AdminPanelProps) => {
  const { t } = useContent();

  const {
    isLoading: isDeleteTokenLoading,
    mutate: deleteToken,
    isError: isDeleteTokenError,
    error: deleteTokenError,
  } = useDeleteRegisterToken(() => {});

  const {
    mutate: postRegisterToken,
    error: postRegisterTokenError,
    isError: isPostRegisterTokenError,
    isLoading: isPostRegisterTokenLoading,
  } = usePostRegisterToken(() => {});

  return (
    <Flex flexDirection="column" bg="white" padding="20px">
      <Text color="var(--dark)" fontSize="20px" fontWeight="500" mb="20px">
        {t("pages.admin_panel.admin_panel")}
      </Text>
      {registerToken && (
        <>
          <Flex
            mb="20px"
            flexDirection="column"
            onClick={() => {
              navigator.clipboard.writeText(registerToken.token);
            }}
            cursor="pointer"
          >
            <Text fontWeight="500" fontSize="105%">
              {t("pages.admin_panel.register_token")}:
            </Text>
            <Text wordBreak="break-all">{registerToken.token}</Text>
          </Flex>
          <Flex flexDirection="column" mb="20px">
            <Text fontWeight="500" fontSize="105%">
              {t("pages.admin_panel.expire_date")}:
            </Text>
            <Text>
              {moment(registerToken.expiresAt).format("DD.MM.YYYY HH:mm")}
            </Text>
          </Flex>
        </>
      )}
      {!registerToken && (
        <Flex flexDirection="column" mb="20px">
          <Text fontWeight="500" fontSize="105%">
            {t("pages.admin_panel.no_register_token")}
          </Text>
          <Text>{t("pages.admin_panel.click_generate")}</Text>
        </Flex>
      )}
      <Flex gap="10px">
        <Button
          colorScheme="blue"
          isLoading={isPostRegisterTokenLoading}
          onClick={() => postRegisterToken()}
        >
          {t("pages.admin_panel.generate")}
        </Button>
        {registerToken && (
          <Button
            isLoading={isDeleteTokenLoading}
            onClick={() => deleteToken()}
            colorScheme="red"
          >
            {t("pages.admin_panel.delete_token")}
          </Button>
        )}
      </Flex>
      {isDeleteTokenError && (
        <Text color="red" fontWeight="600" fontSize="18px">
          {t(
            `errors.backendErrorLabel.${mapAxiosErrorToLabel(deleteTokenError)}`
          )}
        </Text>
      )}
      {isPostRegisterTokenError && (
        <Text color="red" fontWeight="600" fontSize="18px">
          {t(
            `errors.backendErrorLabel.${mapAxiosErrorToLabel(
              postRegisterTokenError
            )}`
          )}
        </Text>
      )}
    </Flex>
  );
};
