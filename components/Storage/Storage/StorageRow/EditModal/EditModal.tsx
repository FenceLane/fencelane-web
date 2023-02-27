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
} from "@chakra-ui/react";
import { useEditProduct } from "../../../../../lib/api/hooks/products";
import { ProductInfo, PRODUCT_VARIANT } from "../../../../../lib/types";
import { useContent } from "../../../../../lib/hooks/useContent";
import styles from "./EditModal.module.scss";

interface EditModalProps {
  isEditOpen: boolean;
  onEditClose: Function;
  onDeletingOpen: Function;
  product: ProductInfo;
}

export const EditModal = ({
  isEditOpen,
  onEditClose,
  onDeletingOpen,
  product,
}: EditModalProps) => {
  const { t } = useContent();

  const [productData, setProductData] = useState({
    ...product,
    stock: String(product.stock),
    itemsPerPackage: String(product.itemsPerPackage),
    volumePerPackage: String(product.volumePerPackage),
  });

  const handleEditModalClose = () => {
    onEditClose(),
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
  } = useEditProduct(handleEditModalClose);

  const handleEditProduct = async () => {
    const {
      dimensions,
      itemsPerPackage,
      name,
      stock,
      variant,
      volumePerPackage,
    } = productData;

    editProduct({
      id: productData.id,
      data: {
        dimensions,
        itemsPerPackage: Number(itemsPerPackage),
        name,
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
    <Modal isOpen={isEditOpen} onClose={handleEditModalClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {t("pages.storage.modals.commodity_modifying")}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody className={styles["modal-inputs"]}>
          <label>{t("pages.storage.table.headings.name")}</label>
          <Input
            name="name"
            value={String(productData.name)}
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
        <ModalFooter>
          <Button
            colorScheme="red"
            mr={20}
            onClick={() => {
              onDeletingOpen(), handleEditModalClose();
            }}
          >
            {t("pages.storage.buttons.delete")}
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleEditProduct}
            mr={3}
            isLoading={isEditLoading}
          >
            {t("pages.storage.buttons.modify")}
          </Button>
          <Button colorScheme="gray" onClick={handleEditModalClose}>
            {t("pages.storage.buttons.cancel")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
