import React, { useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Text,
  TableContainer,
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
import { useContent } from "../../../lib/hooks/useContent";
import styles from "./Storage.module.scss";
import { StorageRow } from "../../StorageRow/StorageRow";
import { AddIcon } from "@chakra-ui/icons";
import { ProductInfo, PRODUCT_VARIANT } from "../../../lib/types";
import { useIsMobile } from "../../../lib/hooks/useIsMobile";
import { usePostProduct } from "../../../lib/api/hooks/products";

interface StorageProps {
  products: ProductInfo[];
}

const initialProductState = {
  name: "",
  dimensions: "",
  variant: PRODUCT_VARIANT.WHITE_WET,
  itemsPerPackage: "",
  volumePerPackage: "",
  stock: "",
};

export const Storage = ({ products }: StorageProps) => {
  const { t } = useContent();
  const isMobile = useIsMobile();
  const [productData, setProductData] = useState(initialProductState);

  const {
    isOpen: isAddingOpen,
    onOpen: onAddingOpen,
    onClose: onAddingClose,
  } = useDisclosure();

  //TODO: handle loading and error states
  const { mutate: postProduct, error, isSuccess, isLoading } = usePostProduct();

  const handlePostProduct = () => {
    const {
      dimensions,
      itemsPerPackage,
      name,
      stock,
      variant,
      volumePerPackage,
    } = productData;

    postProduct({
      dimensions,
      itemsPerPackage: Number(itemsPerPackage),
      name,
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

  const handleVarianChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setProductData((productData) => ({
      ...productData,
      variant: event.target.value as PRODUCT_VARIANT,
    }));
  };

  const handleModalClose = () => {
    onAddingClose();
    setProductData(initialProductState);
  };

  return (
    <>
      <Button
        className={styles["add-button"]}
        rightIcon={<AddIcon />}
        colorScheme="teal"
        variant="solid"
        mb="20px"
        bg="var(--dark)"
        fontSize="15px"
        fontWeight={500}
        onClick={onAddingOpen}
      >
        {t("pages.storage.buttons.add_commodity")}
      </Button>
      <TableContainer className={styles.container}>
        <Table
          variant="simple"
          colorScheme="teal"
          bg="white"
          className={styles["commodity-table"]}
        >
          <Thead className={styles["commodity-table-thead"]}>
            <Tr>
              <Th>
                <Text display="block">
                  {t("pages.storage.table.headings.name")}
                </Text>
                <Text display={isMobile ? "block" : "none"} mt="5px">
                  {t("pages.storage.table.headings.dimensions")}
                </Text>
              </Th>
              {!isMobile && (
                <Th>{t("pages.storage.table.headings.dimensions")}</Th>
              )}
              <Th>{t("pages.storage.table.headings.variant")}</Th>
              <Th>{t("pages.storage.table.headings.itemsPerPackage")}</Th>
              <Th>{t("pages.storage.table.headings.volumePerPackage")}</Th>
              <Th>{t("pages.storage.table.headings.pieces")}</Th>
              <Th>{t("pages.storage.table.headings.stock")}</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {products.map((product: ProductInfo) => (
              <StorageRow key={product.id} product={product}></StorageRow>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Modal isOpen={isAddingOpen} onClose={handleModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {t("pages.storage.modals.commodity_adding")}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className={styles["modal-inputs"]}>
            <Input
              name="name"
              placeholder={t("pages.storage.table.headings.name")}
              value={String(productData.name)}
              onChange={handleChange}
            />
            <Input
              name="dimensions"
              placeholder={t("pages.storage.table.headings.dimensions")}
              value={String(productData.dimensions)}
              onChange={handleChange}
            />
            <Select
              placeholder={t("pages.storage.table.headings.variant")}
              onChange={handleVarianChange}
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
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" onClick={handlePostProduct} mr={3}>
              {t("pages.storage.buttons.add")}
            </Button>
            <Button colorScheme="red" onClick={handleModalClose}>
              {t("pages.storage.buttons.cancel")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
