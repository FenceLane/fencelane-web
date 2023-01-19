import React from "react";
import {
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
} from "@chakra-ui/react";
import { useContent } from "../../lib/hooks/useContent";
import styles from "./Storage.module.scss";
import { PlusSquareIcon } from "@chakra-ui/icons";

const commodityColor = (commodity: String) => {
  if (commodity === "Palisada okorowana") return "#805AD5";
  if (commodity === "Palisada cylindryczna") return "#D53F8C";
  if (commodity === "Palisada prostokątna") return "#38A169";
  if (commodity === "Słupek bramowy") return "#EF7F18";
};
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
            <Tr className={styles["commodity-table-row"]} key={row.id}>
              <Td>
                <Text
                  as="span"
                  bg={commodityColor(row.commodity)}
                  color="white"
                  p="3px 6px"
                  borderRadius="6px"
                  textAlign="left"
                >
                  {row.commodity}
                </Text>
              </Td>
              <Td>{row.dimensions}</Td>
              <Td>{String(row.m3Quantity)}</Td>
              <Td>{String(row.black)}</Td>
              <Td>{String(row.white)}</Td>
              <Td>{String(row.package)}</Td>
              <Td>{String(row.piecesQuantity)}</Td>
              <Td>{String(row.packagesQuantity)}</Td>
              <Td>
                <Button w={8} h={8} bg="white">
                  <PlusSquareIcon
                    w={8}
                    h={8}
                    color={commodityColor(row.commodity)}
                  ></PlusSquareIcon>
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
