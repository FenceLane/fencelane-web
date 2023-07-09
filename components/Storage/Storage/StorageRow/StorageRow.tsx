import React from "react";
import { Text, Tr, Td, useDisclosure, Button } from "@chakra-ui/react";
import styles from "./StorageRow.module.scss";
import { ProductInfo } from "../../../../lib/types";
import { useContent } from "../../../../lib/hooks/useContent";
import { useIsMobile } from "../../../../lib/hooks/useIsMobile";
import { ProductEditModal } from "./ProductEditModal/ProductEditModal";
import { ProductDeleteModal } from "./ProductDeleteModal/ProductDeleteModal";
import { ProductStockAddModal } from "./ProductStockAddModal/ProductStockAddModal";
import { ProductVariantTransferModal } from "./ProductVariantTransferModal/ProductVariantTransferModal";
import { userFeatures } from "../../../../lib/util/userRoles";
import { useUser } from "../../../../lib/hooks/UserContext";

interface StorageRowProps {
  product: ProductInfo;
}

export const StorageRow = ({ product }: StorageRowProps) => {
  const m3 = Number(product.volumePerPackage) * product.stock;

  const pieces = product.itemsPerPackage * product.stock;

  const { t } = useContent();

  const isMobile = useIsMobile();

  const { user } = useUser();

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

  const {
    isOpen: isVariantTransferOpen,
    onOpen: onVariantTransferOpen,
    onClose: onVariantTransferClose,
  } = useDisclosure();

  return (
    <>
      <Tr className={styles["commodity-table-row"]} key={product.id}>
        <Td
          display="flex"
          alignItems="center"
          className={styles["commodity-table-first-cell"]}
        >
          <Text
            bg={product.category.color}
            color="white"
            p="3px 6px"
            ml="10px"
            borderRadius="6px"
          >
            {product.category.name}
          </Text>
          <Text display={isMobile ? "block" : "none"} mt="5px">
            {product.dimensions}
          </Text>
        </Td>
        {!isMobile && <Td>{product.dimensions}</Td>}
        <Td>{String(product.stock < 0 ? 0 : product.stock)}</Td>
        <Td>{t(`pages.storage.variants.${String(product.variant)}`)}</Td>
        <Td>{String(product.itemsPerPackage)}</Td>
        <Td>{String(m3 < 0 ? 0 : m3.toFixed(3).replace(/\.000$/, ""))}</Td>
        <Td>{String(pieces < 0 ? 0 : pieces)}</Td>
        <Td>
          {userFeatures.storage.isManageProductButtonAllowed(user.role) && (
            <Button
              aria-label="Edit product"
              onClick={onEditOpen}
              colorScheme={"red"}
              variant="outline"
              mr="10px"
            >
              {t("pages.storage.buttons.commodity-management")}
            </Button>
          )}
          <Button
            aria-label="Add to product"
            onClick={onStockAddOpen}
            color={product.category.color}
            variant="outline"
            borderColor={product.category.color}
            mr="10px"
          >
            {t("pages.storage.buttons.commodity-add")}
          </Button>
          <Button
            aria-label="Variant transfer"
            onClick={onVariantTransferOpen}
            color={"white"}
            backgroundColor={product.category.color}
            borderColor={product.category.color}
          >
            {t("pages.storage.buttons.variant-transfer")}
          </Button>
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
      <ProductVariantTransferModal
        isVariantTransferOpen={isVariantTransferOpen}
        onVariantTransferClose={onVariantTransferClose}
        product={product}
      />
    </>
  );
};
