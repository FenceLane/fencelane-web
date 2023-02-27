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

interface ProductDeleteModalProps {
  isDeleteOpen: boolean;
  onDeleteClose: () => void;
  product: ProductInfo;
}

export const ProductDeleteModal = ({
  isDeleteOpen,
  onDeleteClose,
  product,
}: ProductDeleteModalProps) => {
  const { t } = useContent();

  const handleDelete = (id: String) => {
    deleteProduct(id);
  };

  const {
    mutate: deleteProduct,
    error: deleteError,
    isSuccess: isDeleteSuccess,
    isLoading: isDeleteLoading,
  } = useDeleteProduct(onDeleteClose);

  return (
    <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
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
          <Button colorScheme="green" onClick={onDeleteClose}>
            {t("pages.storage.buttons.cancel")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
