import {
  Modal,
  ModalContent,
  Input,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Select,
  Text,
  Button,
  ModalFooter,
} from "@chakra-ui/react";
import { mapAxiosErrorToLabel } from "../../../../lib/server/BackendError/BackendError";
import {
  useGetProductsCategories,
  usePostProduct,
} from "../../../../lib/api/hooks/products";
import React, { useState } from "react";
import { useContent } from "../../../../lib/hooks/useContent";
import { PRODUCT_VARIANT } from "../../../../lib/types";
import styles from "./ProductAddModal.module.scss";

const initialProductState = {
  categoryId: "",
  dimensions: "",
  variant: PRODUCT_VARIANT.WHITE_WET,
  itemsPerPackage: "",
  volumePerPackage: "",
  stock: "",
};

interface ProductAddModalProps {
  onAddClose: Function;
  isAddOpen: boolean;
}

export const ProductAddModal = ({
  onAddClose,
  isAddOpen,
}: ProductAddModalProps) => {
  const { t } = useContent();

  const [productData, setProductData] = useState(initialProductState);

  const handleModalClose = () => {
    onAddClose();
    setProductData(initialProductState);
  };

  const {
    mutate: postProduct,
    error,
    isSuccess,
    isLoading,
  } = usePostProduct(handleModalClose);

  const {
    error: categoriesError,
    isSuccess: isCategoriesSuccess,
    isLoading: isCategoriesLoading,
    data: productsCategories,
  } = useGetProductsCategories();

  const handlePostProduct = () => {
    const {
      dimensions,
      itemsPerPackage,
      categoryId,
      stock,
      variant,
      volumePerPackage,
    } = productData;

    postProduct({
      dimensions,
      itemsPerPackage: Number(itemsPerPackage),
      categoryId,
      stock: Number(stock),
      variant: variant,
      volumePerPackage: Number(volumePerPackage),
    });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProductData((productData) => ({
      ...productData,
      [name]: value,
    }));
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setProductData((productData) => ({
      ...productData,
      categoryId: event.target.value,
    }));
  };
  const handleVariantChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setProductData((productData) => ({
      ...productData,
      variant: event.target.value as PRODUCT_VARIANT,
    }));
  };

  return (
    <Modal isOpen={isAddOpen} onClose={handleModalClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("pages.storage.modals.commodity_adding")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody className={styles["modal-inputs"]}>
          <Select
            placeholder={t("pages.storage.table.headings.name")}
            onChange={handleNameChange}
          >
            {productsCategories &&
              productsCategories.map((category) => (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              ))}
          </Select>
          <Input
            name="dimensions"
            placeholder={t("pages.storage.table.headings.dimensions")}
            value={String(productData.dimensions)}
            onChange={handleChange}
          />
          <Select
            placeholder={t("pages.storage.table.headings.variant")}
            onChange={handleVariantChange}
            defaultValue={PRODUCT_VARIANT.WHITE_WET}
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
          <Input
            placeholder={t("pages.storage.table.headings.itemsPerPackage")}
            type="number"
            value={String(productData.itemsPerPackage)}
            name="itemsPerPackage"
            onChange={handleChange}
          />
          <Input
            placeholder={t("pages.storage.table.headings.volumePerPackage")}
            type="number"
            value={String(productData.volumePerPackage)}
            name="volumePerPackage"
            onChange={handleChange}
          />
          <Input
            placeholder={t("pages.storage.table.headings.stock")}
            type="number"
            value={String(productData.stock)}
            name="stock"
            onChange={handleChange}
          />
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
            onClick={handlePostProduct}
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
