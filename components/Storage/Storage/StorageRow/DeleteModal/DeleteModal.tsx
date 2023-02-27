import React from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
} from "@chakra-ui/react";
import { ProductInfo } from "../../../../../lib/types";
import { useContent } from "../../../../../lib/hooks/useContent";
import { useDeleteProduct } from "../../../../../lib/api/hooks/products";
import { mapAxiosErrorToLabel } from "../../../../../lib/server/BackendError/BackendError";

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

  const handleDelete = (id: String) => {
    deleteProduct(id);
  };

  const {
    mutate: deleteProduct,
    error: deleteError,
    isSuccess: isDeleteSuccess,
    isLoading: isDeleteLoading,
  } = useDeleteProduct(onDeletingClose);

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
          {!!deleteError && (
            <Text color="red">
              {t(
                `errors.backendErrorLabel.${mapAxiosErrorToLabel(deleteError)}`
              )}
            </Text>
          )}
          <Button
            colorScheme="red"
            onClick={() => handleDelete(product.id)}
            mr={3}
            isLoading={isDeleteLoading}
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
