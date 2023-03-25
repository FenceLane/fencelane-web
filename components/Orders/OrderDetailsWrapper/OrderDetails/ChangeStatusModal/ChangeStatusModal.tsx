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

const statusLabels = {
  [ORDER_STATUS.ORDER_CREATED]: "Utworzono zamówienie",
  [ORDER_STATUS.RECEIVED_IN_STORAGE]: "Przyjęto na magazynie",
  [ORDER_STATUS.DRIED]: "Wysuszono",
  [ORDER_STATUS.IMPREGNATED]: "Nasycono",
  [ORDER_STATUS.SENT]: "Wysłano",
  [ORDER_STATUS.DELIVERED]: "Dostarczono",
} as const;

export const ChangeStatusModal = ({
  id,
  onClose,
  isOpen,
  oldStatus,
}: ChangeStatusModalProps) => {
  const { t } = useContent();

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
    if (newStatus !== oldStatus) {
      updateStatus({ status: newStatus });
    }
  };

  const handleChange = (value: ORDER_STATUS) => {
    setNewStatus(value);
  };

  const isOptionDisabled = (option: ORDER_STATUS) => {
    const statuses = Object.keys(statusLabels) as ORDER_STATUS[];
    return statuses.indexOf(option) < statuses.indexOf(oldStatus);
  };

  return (
    <div>
      <Modal isOpen={isOpen} onClose={handleModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Zmiana statusu</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <RadioGroup
              onChange={(value: ORDER_STATUS) => handleChange(value)}
              value={newStatus}
            >
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
              Zmień
            </Button>
            <Button colorScheme="red" onClick={handleModalClose}>
              {t("pages.storage.buttons.cancel")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
