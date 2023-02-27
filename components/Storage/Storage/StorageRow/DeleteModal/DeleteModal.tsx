import React from "react";
import { apiClient } from "../../../../../lib/api/apiClient";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { ProductInfo } from "../../../../../lib/types";
import { useContent } from "../../../../../lib/hooks/useContent";

const handleDelete = (id: String) => {
  apiClient.products.deleteProduct(id);
  window.location.reload();
};

interface DeleteModalProps {
  isDeletingOpen: boolean;
  onDeletingClose: () => void;
  product: ProductInfo;
}

export const DeleteModal = ({
  isDeletingOpen,
  onDeletingClose,
  product,
}: DeleteModalProps) => {
  const { t } = useContent();

  return (
    <Modal isOpen={isDeletingOpen} onClose={onDeletingClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {t("pages.storage.modals.commodity_deleting")}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>{t("pages.storage.modals.are_you_sure")}</ModalBody>
        <ModalFooter>
          <Button
            colorScheme="red"
            onClick={() => handleDelete(product.id)}
            mr={3}
          >
            {t("pages.storage.buttons.delete")}
          </Button>
          <Button colorScheme="green" onClick={onDeletingClose}>
            {t("pages.storage.buttons.cancel")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
