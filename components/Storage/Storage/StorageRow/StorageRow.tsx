import React, { useRef } from "react";
import { Text, Tr, Td, Button, useDisclosure } from "@chakra-ui/react";
import styles from "./StorageRow.module.scss";
import { EditIcon } from "@chakra-ui/icons";
import { ProductInfo } from "../../../../lib/types";
import { useContent } from "../../../../lib/hooks/useContent";
import { useIsMobile } from "../../../../lib/hooks/useIsMobile";
import { EditModal } from "./EditModal/EditModal";
import { DeleteModal } from "./DeleteModal/DeleteModal";

interface StorageRowProps {
  product: ProductInfo;
}

export const StorageRow = ({ product }: StorageRowProps) => {
  const color = `#${product.id.substring(0, 6)}`;

  const pieces = product.itemsPerPackage * product.stock;

  const { t } = useContent();

  const isMobile = useIsMobile();

  const ref = useRef<HTMLDivElement | null>(null);

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
          <Button w={8} h={8} bg="white">
            <EditIcon
              onClick={onEditOpen}
              w="28px"
              h="28px"
              color={color}
            ></EditIcon>
          </Button>
        </Td>
      </Tr>
      <EditModal
        isEditOpen={isEditOpen}
        onEditClose={onEditClose}
        onDeletingOpen={onDeletingOpen}
        product={product}
      />
      <DeleteModal
        isDeletingOpen={isDeletingOpen}
        onDeletingClose={onDeletingClose}
        product={product}
      />
    </>
  );
};
