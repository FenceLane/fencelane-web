import React from "react";
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
} from "@chakra-ui/react";
import { useContent } from "../../../lib/hooks/useContent";
import styles from "./Storage.module.scss";
import { StorageRow } from "../../StorageRow/StorageRow";
import { AddIcon } from "@chakra-ui/icons";
import { ProductInfo } from "../../../lib/types";
import { useIsMobile } from "../../../lib/hooks/useIsMobile";
import { AddingModal } from "./AddingModal/AddingModal";

interface StorageProps {
  products: ProductInfo[];
}

export const Storage = ({ products }: StorageProps) => {
  const { t } = useContent();
  const isMobile = useIsMobile();

  const {
    isOpen: isAddingOpen,
    onOpen: onAddingOpen,
    onClose: onAddingClose,
  } = useDisclosure();

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
      <AddingModal onAddingClose={onAddingClose} isAddingOpen={isAddingOpen} />
    </>
  );
};
