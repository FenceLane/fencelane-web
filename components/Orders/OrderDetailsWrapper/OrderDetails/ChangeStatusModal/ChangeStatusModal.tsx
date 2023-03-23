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

interface ChangeStatusModalProps {
  id: number;
  onClose: Function;
  isOpen: boolean;
  oldStatus: string;
}

export const ChangeStatusModal = ({
  id,
  onClose,
  isOpen,
  oldStatus,
}: ChangeStatusModalProps) => {
  const { t } = useContent();

  const [newStatus, setNewStatus] = useState(oldStatus);

  const handleModalClose = () => {
    onClose();
    setNewStatus(oldStatus);
  };

  const {
    mutate: updateStatus,
    error,
    isSuccess,
    isLoading,
  } = useUpdateStatus(handleModalClose);

  const handleUpdateStatus = () => {
    if (newStatus !== oldStatus) {
      updateStatus({ id: id, data: { status: newStatus } });
    }
  };

  const handleChange = (value: string) => {
    setNewStatus(value);
  };

  const statuses = [
    "order created",
    "received in storage",
    "dried",
    "impregnated",
    "sent",
    "delivered",
  ];

  const isOptionDisabled = (option: string) => {
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
              onChange={(value) => handleChange(value)}
              value={newStatus}
            >
              <Stack direction="column">
                <Radio
                  value={statuses[0]}
                  isDisabled={isOptionDisabled(statuses[0])}
                >
                  Utworzono zamówienie
                </Radio>

                <Radio
                  value={statuses[1]}
                  isDisabled={isOptionDisabled(statuses[1])}
                >
                  Przyjęto na magazynie
                </Radio>

                <Radio
                  value={statuses[2]}
                  isDisabled={isOptionDisabled(statuses[2])}
                >
                  Wysuszono
                </Radio>

                <Radio
                  value={statuses[3]}
                  isDisabled={isOptionDisabled(statuses[3])}
                >
                  Nasycono
                </Radio>

                <Radio
                  value={statuses[4]}
                  isDisabled={isOptionDisabled(statuses[4])}
                >
                  Wysłano
                </Radio>

                <Radio
                  value={statuses[5]}
                  isDisabled={isOptionDisabled(statuses[5])}
                >
                  Dostarczono
                </Radio>
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
