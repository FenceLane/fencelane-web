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
import { useUpdateStatus } from "../../../../../lib/api/hooks/orders";
import { useContent } from "../../../../../lib/hooks/useContent";
import { mapAxiosErrorToLabel } from "../../../../../lib/server/BackendError/BackendError";
import { ORDER_STATUS } from "../../../../../lib/types";

interface ChangeStatusModalProps {
  id: number;
  onClose: Function;
  isOpen: boolean;
  oldStatus: ORDER_STATUS;
}

export const ChangeStatusModal = ({
  id,
  onClose,
  isOpen,
  oldStatus,
}: ChangeStatusModalProps) => {
  const { t } = useContent();

  const statusLabels = {
    [ORDER_STATUS.ORDER_CREATED]: t("pages.loads.status.load-created"),
    [ORDER_STATUS.RECEIVED_IN_STORAGE]: t(
      "pages.loads.status.received-in-storage"
    ),
    [ORDER_STATUS.DRIED]: t("pages.loads.status.dried"),
    [ORDER_STATUS.IMPREGNATED]: t("pages.loads.status.impregnated"),
    [ORDER_STATUS.SENT]: t("pages.loads.status.sent"),
    [ORDER_STATUS.DELIVERED]: t("pages.loads.status.delivered"),
  } as const;

  const [newStatus, setNewStatus] = useState<ORDER_STATUS>(oldStatus);

  const handleModalClose = () => {
    onClose();
    setNewStatus(oldStatus);
  };

  const {
    mutate: updateStatus,
    error,
    isSuccess,
    isLoading,
  } = useUpdateStatus(id, handleModalClose);

  const handleUpdateStatus = () => {
    updateStatus({ status: newStatus });
  };

  const handleChange = (value: ORDER_STATUS) => {
    setNewStatus(value);
  };

  const isOptionDisabled = (option: ORDER_STATUS) => {
    const statuses = Object.keys(statusLabels) as ORDER_STATUS[];
    return statuses.indexOf(option) <= statuses.indexOf(oldStatus);
  };

  return (
    <div>
      <Modal isOpen={isOpen} onClose={handleModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("pages.loads.load.status-change")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <RadioGroup onChange={(value: ORDER_STATUS) => handleChange(value)}>
              <Stack direction="column">
                {Object.entries(statusLabels).map(([status, label]) => (
                  <Radio
                    key={status}
                    value={status}
                    isDisabled={isOptionDisabled(status as ORDER_STATUS)}
                  >
                    {label}
                  </Radio>
                ))}
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
              onClick={handleUpdateStatus}
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
    </div>
  );
};
