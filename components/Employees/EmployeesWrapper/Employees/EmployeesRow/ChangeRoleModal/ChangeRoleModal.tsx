import {
  Text,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  Button,
  RadioGroup,
  Stack,
  Radio,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useChangeRole } from "../../../../../../lib/api/hooks/employees";
import { useContent } from "../../../../../../lib/hooks/useContent";
import { mapAxiosErrorToLabel } from "../../../../../../lib/server/BackendError/BackendError";
import { USER_ROLE } from "../../../../../../lib/types";

interface ChangeRoleModalProps {
  id: string;
  onClose: Function;
  isOpen: boolean;
  oldRole: number;
}

export const ChangeRoleModal = ({
  id,
  onClose,
  isOpen,
  oldRole,
}: ChangeRoleModalProps) => {
  const { t } = useContent();

  const roleLabels = {
    [USER_ROLE.ADMIN]: t("pages.employees.roles.admin"),
    [USER_ROLE.USER]: t("pages.employees.roles.user"),
    [USER_ROLE.BOSS]: t("pages.employees.roles.boss"),
    [USER_ROLE.VICE_BOSS]: t("pages.employees.roles.vice_boss"),
    [USER_ROLE.SATURATOR]: t("pages.employees.roles.saturator"),
    [USER_ROLE.MARKETER]: t("pages.employees.roles.marketer"),
  } as const;

  const [newRole, setNewRole] = useState<USER_ROLE>(oldRole);

  const handleModalClose = () => {
    onClose();
    setNewRole(oldRole);
  };

  const {
    mutate: changeRole,
    error,
    isSuccess,
    isLoading,
  } = useChangeRole(id, () => onClose());

  const handleChangeRole = () => {
    changeRole({ role: newRole });
  };

  const handleChange = (value: string) => {
    setNewRole(Number(value));
  };

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("pages.employees.role_change")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <RadioGroup
            defaultValue={String(newRole)}
            onChange={(value) => handleChange(value)}
          >
            <Stack direction="column">
              {Object.entries(roleLabels).map(([role, label]) => {
                return (
                  <Radio key={role} value={role}>
                    {label}
                  </Radio>
                );
              })}
            </Stack>
          </RadioGroup>
          {!!error && (
            <Text color="red">
              {t(`errors.backendErrorLabel.${mapAxiosErrorToLabel(error)}`)}
            </Text>
          )}
        </ModalBody>
        <ModalFooter alignItems="flex-end">
          <Button
            colorScheme="green"
            isLoading={isLoading}
            onClick={handleChangeRole}
            mr={3}
          >
            {t("buttons.confirm")}
          </Button>
          <Button colorScheme="red" onClick={handleModalClose}>
            {t("buttons.cancel")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
