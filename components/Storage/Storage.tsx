import React, { useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
  Button,
} from "@chakra-ui/react";
import { useContent } from "../../lib/hooks/useContent";
import styles from "./Storage.module.scss";
import { StorageRow } from "../StorageRow/StorageRow";
import { AddIcon } from "@chakra-ui/icons";

interface CSTypes {
  id: React.Key;
  commodity: String;
  dimensions: String;
  m3Quantity: Number;
  black: Number;
  white: Number;
  package: Number;
  piecesQuantity: Number;
  packagesQuantity: Number;
}

export const Storage = (props: any) => {
  const commodityStock: CSTypes[] = props.commodityStock;
  const { t } = useContent();

  const [data, setData] = useState([]);

  return (
    <>
      <Button
        className={styles["add-button"]}
        rightIcon={<AddIcon />}
        colorScheme="teal"
        variant="solid"
        mb="20px"
        bg="var(--dark)"
      >
        Dodaj towar
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
              <Th>{t("pages.storage.table.headings.commodity")}</Th>
              <Th>{t("pages.storage.table.headings.dimensions")}</Th>
              <Th>{t("pages.storage.table.headings.m3Quantity")}</Th>
              <Th>{t("pages.storage.table.headings.black")}</Th>
              <Th>{t("pages.storage.table.headings.white")}</Th>
              <Th>{t("pages.storage.table.headings.package")}</Th>
              <Th>{t("pages.storage.table.headings.piecesQuantity")}</Th>
              <Th>{t("pages.storage.table.headings.packagesQuantity")}</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {commodityStock.map((row) => (
              <StorageRow key={row.id} row={row}></StorageRow>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};
