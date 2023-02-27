import React, { useRef, useState } from "react";
import {
  Text,
  Tr,
  Td,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Select,
} from "@chakra-ui/react";
import { useOnClickOutside } from "../../lib/hooks/useOnClickOutside";
import styles from "./StorageRow.module.scss";
import { EditIcon } from "@chakra-ui/icons";
import { apiClient } from "../../lib/api/apiClient";
import { ProductInfo, PRODUCT_VARIANT } from "../../lib/types";
import { useContent } from "../../lib/hooks/useContent";
import { useIsMobile } from "../../lib/hooks/useIsMobile";
import { useEditProduct } from "../../lib/api/hooks/products";
import { mapAxiosErrorToLabel } from "../../lib/server/BackendError/BackendError";

const handleDelete = (id: String) => {
  apiClient.products.deleteProduct(id);
  window.location.reload();
};

interface StorageRowProps {
  product: ProductInfo;
}

export const StorageRow = ({ product }: StorageRowProps) => {
  const color = `#${product.id.substring(0, 6)}`;

  const pieces = product.itemsPerPackage * product.stock;

  const { t } = useContent();

  const isMobile = useIsMobile();

  const [productData, setProductData] = useState({
    ...product,
    stock: String(product.stock),
    itemsPerPackage: String(product.itemsPerPackage),
    volumePerPackage: String(product.volumePerPackage),
  });

  const [showOptions, setShowOptions] = useState(false);

  const ref = useRef<HTMLDivElement | null>(null);

  useOnClickOutside(ref, () => setShowOptions(false));

  const {
    isOpen: isDeletingOpen,
    onOpen: onDeletingOpen,
    onClose: onDeletingClose,
  } = useDisclosure();

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

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
    isSuccess: isEditSuccess,
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
    if (editError) {
      console.log(editError);
      console.log("error");
    }
    if (isEditSuccess) {
      console.log("ok");
      handleEditModalClose();
    }
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
    <>
      <Tr className={styles["commodity-table-row"]} key={product.id}>
        <Td>
          <Text
            mt="5px"
            as="span"
            bg={color}
            color="white"
            p="3px 6px"
            borderRadius="6px"
            textAlign="center"
          >
            {product.name}
          </Text>
          <Text display={isMobile ? "block" : "none"} mt="5px">
            {product.dimensions}
          </Text>
        </Td>
        {!isMobile && <Td>{product.dimensions}</Td>}
        <Td>{t(`pages.storage.variants.${String(product.variant)}`)}</Td>
        <Td>{String(product.itemsPerPackage)}</Td>
        <Td>{String(product.volumePerPackage)}</Td>
        <Td>{String(pieces)}</Td>
        <Td>{String(product.stock)}</Td>
        <Td>
          <Button
            w={8}
            h={8}
            bg="white"
            onClick={() => setShowOptions((prev) => !prev)}
          >
            <EditIcon
              onClick={onEditOpen}
              w="28px"
              h="28px"
              color={color}
            ></EditIcon>
          </Button>
        </Td>
      </Tr>
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
            <Text color="red">
              {!!editError && t(mapAxiosErrorToLabel(editError))}
            </Text>
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
    </>
  );
};
