import React, { useState } from "react";
import { mapAxiosErrorToLabel } from "../../../../../lib/server/BackendError/BackendError";
import {
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  Box,
} from "@chakra-ui/react";
import { useEditProduct } from "../../../../../lib/api/hooks/products";
import { ProductInfo } from "../../../../../lib/types";
import { useContent } from "../../../../../lib/hooks/useContent";

import { toastInfo } from "../../../../../lib/util/toasts";

interface ProductEditModalProps {
  isStockAddOpen: boolean;
  onStockAddClose: Function;
  product: ProductInfo;
}

export const ProductStockAddModal = ({
  isStockAddOpen,
  onStockAddClose,
  product,
}: ProductEditModalProps) => {
  const { t } = useContent();

  const [newStock, setNewStock] = useState(0);

  const handleSuccess = () => {
    handleProductStockAddModalClose();
    toastInfo(
      `${t("pages.storage.toasts.add_commodity_success1")} ${newStock} ${t(
        "pages.storage.toasts.add_commodity_success2"
      )}`
    );
  };

  const handleProductStockAddModalClose = () => {
    onStockAddClose();
  };

  const {
    mutate: editProduct,
    error: editError,
    isLoading: isEditLoading,
  } = useEditProduct(handleSuccess);

  const handleEditProduct = async () => {
    const {
      dimensions,
      itemsPerPackage,
      category,
      stock,
      variant,
      volumePerPackage,
    } = product;

    const stockAdd = newStock;

    setNewStock(0);

    editProduct({
      id: product.id,
      data: {
        dimensions,
        itemsPerPackage: Number(itemsPerPackage),
        categoryId: category.id,
        stock: Number(stock) + stockAdd,
        variant: variant,
        volumePerPackage: Number(volumePerPackage),
      },
    });
  };

  return (
    <Modal isOpen={isStockAddOpen} onClose={handleProductStockAddModalClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("pages.storage.modals.commodity_adding")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontWeight="600">{product.category.name}</Text>
          <Text fontWeight="600">{product.dimensions}</Text>
          <Text fontWeight="600" mb="20px">
            {t(`pages.storage.variants.${product.variant}`)}
          </Text>
          <label>{t("pages.storage.modals.insert_product_quantity")}</label>
          <Input
            mb="10px"
            name="stock"
            type="number"
            placeholder="Ilość"
            onChange={(e) => setNewStock(Number(e.target.value))}
          />
          {!!editError && (
            <Text color="red">
              {t(`errors.backendErrorLabel.${mapAxiosErrorToLabel(editError)}`)}
            </Text>
          )}
        </ModalBody>
        <ModalFooter justifyContent="space-between">
          <Box>
            <Button
              colorScheme="green"
              onClick={handleEditProduct}
              mr={3}
              isLoading={isEditLoading}
            >
              {t("buttons.add")}
            </Button>
            <Button
              colorScheme="gray"
              onClick={handleProductStockAddModalClose}
            >
              {t("pages.storage.buttons.cancel")}
            </Button>
          </Box>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
