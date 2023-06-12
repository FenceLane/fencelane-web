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
  useDisclosure,
  Flex,
} from "@chakra-ui/react";
import { useContent } from "../../../lib/hooks/useContent";
import styles from "./Storage.module.scss";
import { StorageRow } from "./StorageRow/StorageRow";
import { AddIcon } from "@chakra-ui/icons";
import { PRODUCT_VARIANT, ProductInfo } from "../../../lib/types";
import { useIsMobile } from "../../../lib/hooks/useIsMobile";
import { ProductAddModal } from "./ProductAddModal/ProductAddModal";

interface StorageProps {
  products: ProductInfo[];
}

const initialVariantFilters = {
  [PRODUCT_VARIANT.WHITE_WET]: true,
  [PRODUCT_VARIANT.WHITE_DRY]: true,
  [PRODUCT_VARIANT.BLACK]: false,
};

export const Storage = ({ products }: StorageProps) => {
  const { t } = useContent();
  const isMobile = useIsMobile();

  const [variantFilters, setVariantFilters] = useState(initialVariantFilters);

  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();

  const handleVariantFilterChange = (variant: PRODUCT_VARIANT) => {
    setVariantFilters((prev) => ({ ...prev, [variant]: !prev[variant] }));
  };

  return (
    <>
      <Flex className={styles["buttons"]}>
        <Flex className={styles["add-button"]}>
          <Button
            rightIcon={<AddIcon />}
            colorScheme="teal"
            variant="solid"
            mb="10px"
            bg="var(--dark)"
            fontSize="15px"
            fontWeight={500}
            onClick={onAddOpen}
          >
            {t("pages.storage.buttons.add_commodity")}
          </Button>
        </Flex>
        <Flex mb="10px" gap="10px" className={styles["variant-filters"]}>
          <Button
            onClick={() => handleVariantFilterChange(PRODUCT_VARIANT.WHITE_DRY)}
            colorScheme={variantFilters.white_dry ? "green" : "white"}
            variant={variantFilters.white_dry ? "solid" : "outline"}
          >
            Biały suchy
          </Button>
          <Button
            onClick={() => handleVariantFilterChange(PRODUCT_VARIANT.WHITE_WET)}
            colorScheme={variantFilters.white_wet ? "green" : "white"}
            variant={variantFilters.white_wet ? "solid" : "outline"}
          >
            Biały mokry
          </Button>
          <Button
            onClick={() => handleVariantFilterChange(PRODUCT_VARIANT.BLACK)}
            colorScheme={variantFilters.black ? "green" : "white"}
            variant={variantFilters.black ? "solid" : "outline"}
          >
            Czarny
          </Button>
        </Flex>
      </Flex>
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
              <Th>{t("pages.storage.table.headings.stock")}</Th>
              <Th>{t("pages.storage.table.headings.variant")}</Th>
              <Th>{t("pages.storage.table.headings.itemsPerPackage")}</Th>
              <Th>{t("pages.storage.table.headings.m3")}</Th>
              <Th>{t("pages.storage.table.headings.pieces")}</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {products
              .filter((product) => variantFilters[product.variant])
              .map((product: ProductInfo) => (
                <StorageRow key={product.id} product={product}></StorageRow>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
      <ProductAddModal onAddClose={onAddClose} isAddOpen={isAddOpen} />
    </>
  );
};
