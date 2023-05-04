import React, { useRef } from "react";
import { Text, Tr, Td, useDisclosure, IconButton } from "@chakra-ui/react";
import styles from "./StorageRow.module.scss";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import { ProductInfo } from "../../../../lib/types";
import { useContent } from "../../../../lib/hooks/useContent";
import { useIsMobile } from "../../../../lib/hooks/useIsMobile";
import { ProductEditModal } from "./ProductEditModal/ProductEditModal";
import { ProductDeleteModal } from "./ProductDeleteModal/ProductDeleteModal";
import { ProductStockAddModal } from "./ProductStockAddModal/ProductStockAddModal";

interface StorageRowProps {
  product: ProductInfo;
}

export const StorageRow = ({ product }: StorageRowProps) => {
  const m3 = product.volumePerPackage * product.stock;

  const pieces = product.itemsPerPackage * product.stock;

  const { t } = useContent();

  const isMobile = useIsMobile();

  const ref = useRef<HTMLDivElement | null>(null);

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const {
    isOpen: isStockAddOpen,
    onOpen: onStockAddOpen,
    onClose: onStockAddClose,
  } = useDisclosure();

  return (
    <>
      <Tr className={styles["commodity-table-row"]} key={product.id}>
        <Td>
          <Text
            mt="5px"
            as="span"
            bg={product.category.color}
            color="white"
            p="3px 6px"
            borderRadius="6px"
            textAlign="center"
          >
            {product.category.name}
          </Text>
          <Text display={isMobile ? "block" : "none"} mt="5px">
            {product.dimensions}
          </Text>
        </Td>
        {!isMobile && <Td>{product.dimensions}</Td>}
        <Td>{String(product.stock)}</Td>
        <Td>{t(`pages.storage.variants.${String(product.variant)}`)}</Td>
        <Td>{String(product.itemsPerPackage)}</Td>
        <Td>{String(m3)}</Td>
        <Td>{String(pieces)}</Td>
        <Td>
          <IconButton
            icon={<EditIcon w="32px" h="32px" />}
            aria-label="Edit product"
            bg="white"
            onClick={onEditOpen}
            w="32px"
            color={product.category.color}
          ></IconButton>
          <IconButton
            icon={<AddIcon w="28px" h="28px" />}
            aria-label="Add to product"
            bg="white"
            onClick={onStockAddOpen}
            w="32px"
            color={product.category.color}
          ></IconButton>
        </Td>
      </Tr>
      <ProductEditModal
        isEditOpen={isEditOpen}
        onEditClose={onEditClose}
        onDeletingOpen={onDeleteOpen}
        product={product}
      />
      <ProductDeleteModal
        isDeleteOpen={isDeleteOpen}
        onDeleteClose={onDeleteClose}
        product={product}
      />
      <ProductStockAddModal
        isStockAddOpen={isStockAddOpen}
        onStockAddClose={onStockAddClose}
        product={product}
      />
    </>
  );
};
