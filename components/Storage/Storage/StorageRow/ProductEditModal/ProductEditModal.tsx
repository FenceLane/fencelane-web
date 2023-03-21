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
  Select,
  Box,
} from "@chakra-ui/react";
import { useEditProduct } from "../../../../../lib/api/hooks/products";
import { ProductInfo, PRODUCT_VARIANT } from "../../../../../lib/types";
import { useContent } from "../../../../../lib/hooks/useContent";
import styles from "./ProductEditModal.module.scss";

interface ProductEditModalProps {
  isEditOpen: boolean;
  onEditClose: Function;
  onDeletingOpen: Function;
  product: ProductInfo;
}

export const ProductEditModal = ({
  isEditOpen,
  onEditClose,
  onDeletingOpen,
  product,
}: ProductEditModalProps) => {
  const { t } = useContent();

  const [productData, setProductData] = useState({
    ...product,
    stock: String(product.stock),
    itemsPerPackage: String(product.itemsPerPackage),
    volumePerPackage: String(product.volumePerPackage),
  });

  const handleProductEditModalClose = () => {
    onEditClose();
    setProductData({
      ...product,
      stock: String(product.stock),
      itemsPerPackage: String(product.itemsPerPackage),
      volumePerPackage: String(product.volumePerPackage),
    });
  };

  const {
    mutate: editProduct,
    error: editError,
    isLoading: isEditLoading,
  } = useEditProduct(handleProductEditModalClose);

  const handleEditProduct = async () => {
    const {
      dimensions,
      itemsPerPackage,
      category,
      stock,
      variant,
      volumePerPackage,
    } = productData;

    editProduct({
      id: productData.id,
      data: {
        dimensions,
        itemsPerPackage: Number(itemsPerPackage),
        categoryId: category.id,
        stock: Number(stock),
        variant: variant,
        volumePerPackage: Number(volumePerPackage),
      },
    });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProductData((productData) => ({
      ...productData,
      [name]: value,
    }));
  };

  const handleVariantChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setProductData((productData) => ({
      ...productData,
      variant: event.target.value as PRODUCT_VARIANT,
    }));
  };

  return (
    <Modal isOpen={isEditOpen} onClose={handleProductEditModalClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {t("pages.storage.modals.commodity_modifying")}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody className={styles["modal-inputs"]}>
          <label>{t("pages.storage.table.headings.name")}</label>
          <Input
            name="categoryId"
            value={String(productData.category.name)}
            onChange={handleChange}
          />
          <label>{t("pages.storage.table.headings.dimensions")}</label>
          <Input
            name="dimensions"
            value={String(productData.dimensions)}
            onChange={handleChange}
          />
          <label>{t("pages.storage.table.headings.variant")}</label>
          <Select
            onChange={handleVariantChange}
            defaultValue={productData.variant}
          >
            <option value={PRODUCT_VARIANT.WHITE_WET}>
              {t("pages.storage.variants.white_wet")}
            </option>
            <option value={PRODUCT_VARIANT.WHITE_DRY}>
              {t("pages.storage.variants.white_dry")}
            </option>
            <option value={PRODUCT_VARIANT.BLACK}>
              {t("pages.storage.variants.black")}
            </option>
          </Select>
          <label>{t("pages.storage.table.headings.itemsPerPackage")}</label>
          <Input
            name="itemsPerPackage"
            type="number"
            value={productData.itemsPerPackage}
            onChange={handleChange}
          />
          <label>{t("pages.storage.table.headings.volumePerPackage")}</label>
          <Input
            name="volumePerPackage"
            type="number"
            value={productData.volumePerPackage}
            onChange={handleChange}
          />
          <label>{t("pages.storage.table.headings.stock")}</label>
          <Input
            name="stock"
            type="number"
            value={productData.stock}
            onChange={handleChange}
          />
          {!!editError && (
            <Text color="red">
              {t(`errors.backendErrorLabel.${mapAxiosErrorToLabel(editError)}`)}
            </Text>
          )}
        </ModalBody>
        <ModalFooter justifyContent="space-between">
          <Button
            colorScheme="red"
            onClick={() => {
              onDeletingOpen();
              handleProductEditModalClose();
            }}
          >
            {t("pages.storage.buttons.delete")}
          </Button>
          <Box>
            <Button
              colorScheme="blue"
              onClick={handleEditProduct}
              mr={3}
              isLoading={isEditLoading}
            >
              {t("pages.storage.buttons.modify")}
            </Button>
            <Button colorScheme="gray" onClick={handleProductEditModalClose}>
              {t("pages.storage.buttons.cancel")}
            </Button>
          </Box>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
