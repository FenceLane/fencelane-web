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

  const handleProductStockAddModalClose = () => {
    onStockAddClose();
  };

  const {
    mutate: editProduct,
    error: editError,
    isLoading: isEditLoading,
  } = useEditProduct(handleProductStockAddModalClose);

  const handleEditProduct = async () => {
    const {
      dimensions,
      itemsPerPackage,
      category,
      stock,
      variant,
      volumePerPackage,
    } = product;

    editProduct({
      id: product.id,
      data: {
        dimensions,
        itemsPerPackage: Number(itemsPerPackage),
        categoryId: category.id,
        stock: Number(stock) + newStock,
        variant: variant,
        volumePerPackage: Number(volumePerPackage),
      },
    });
  };

  return (
    <Modal isOpen={isStockAddOpen} onClose={handleProductStockAddModalClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Dodawanie towaru</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontWeight="600">{product.category.name}</Text>
          <Text fontWeight="600">{product.dimensions}</Text>
          <Text fontWeight="600">
            {t(`pages.storage.variants.${product.variant}`)}
          </Text>
          <label>Wprowadź ilość dodawanego towaru</label>
          <Input
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
              Dodaj
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
