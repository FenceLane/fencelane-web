import {
  Modal,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  ModalFooter,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useContent } from "../../../lib/hooks/useContent";
import styles from "./OrderAddModal.module.scss";
import {
  useGetClients,
  useGetDestinations,
  usePostOrder,
} from "../../../lib/api/hooks/orders";

const initialOrderState = {};

interface OrderAddModalProps {
  onAddClose: Function;
  isAddOpen: boolean;
}

export const OrderAddModal = ({
  onAddClose,
  isAddOpen,
}: OrderAddModalProps) => {
  const { t } = useContent();

  const [orderData, setOrderData] = useState(initialOrderState);

  const {
    isError: isClientsError,
    error: clientsError,
    isLoading: isClientsLoading,
    data: clients,
  } = useGetClients();

  const {
    isError: isDestinationsError,
    error: destinationsError,
    isLoading: isDestinationsLoading,
    data: destinations,
  } = useGetDestinations();

  const handleModalClose = () => {
    onAddClose();
    setOrderData(initialOrderState);
  };

  const {
    mutate: postOrder,
    error,
    isSuccess,
    isLoading,
  } = usePostOrder(handleModalClose);

  const handlePostOrder = () => {
    const {} = orderData;

    postOrder({});
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setOrderData((orderData) => ({
      ...orderData,
      [name]: value,
    }));
  };

  return (
    <Modal isOpen={isAddOpen} onClose={handleModalClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("pages.storage.modals.commodity_adding")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody className={styles["modal-inputs"]}></ModalBody>
        <ModalFooter alignItems="flex-end">
          <Button
            colorScheme="green"
            isLoading={isLoading}
            onClick={handlePostOrder}
            mr={3}
          >
            {t("pages.storage.buttons.add")}
          </Button>
          <Button colorScheme="red" onClick={handleModalClose}>
            {t("pages.storage.buttons.cancel")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
