import React from "react";
import { Table, Thead, Tbody, Tr, Th, TableContainer } from "@chakra-ui/react";
import { useContent } from "../../lib/hooks/useContent";
import styles from "./Storage.module.scss";
import { Row } from "../Row/Row";

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
  return (
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
            <Row key={row.id} row={row}></Row>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
