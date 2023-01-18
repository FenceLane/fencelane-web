import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { useContent } from "../../lib/hooks/useContent";

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
export const Storage = () => {
  const { t } = useContent();
  const commodityStock: CSTypes[] = [
    {
      id: 1,
      commodity: "Palisada okorowana",
      dimensions: "75 - 100 x 1650",
      m3Quantity: 21.714,
      black: 21.714,
      white: 0,
      package: 105,
      piecesQuantity: 2310,
      packagesQuantity: 22,
    },
    {
      id: 2,
      commodity: "Palisada cylindryczna",
      dimensions: "75 - 100 x 1650",
      m3Quantity: 21.714,
      black: 21.714,
      white: 0,
      package: 105,
      piecesQuantity: 2310,
      packagesQuantity: 22,
    },
    {
      id: 3,
      commodity: "Palisada prostokątna",
      dimensions: "75 - 100 x 1650",
      m3Quantity: 21.714,
      black: 21.714,
      white: 0,
      package: 105,
      piecesQuantity: 2310,
      packagesQuantity: 22,
    },
    {
      id: 4,
      commodity: "Słupek bramowy",
      dimensions: "75 - 100 x 1650",
      m3Quantity: 21.714,
      black: 21.714,
      white: 0,
      package: 105,
      piecesQuantity: 2310,
      packagesQuantity: 22,
    },
    {
      id: 5,
      commodity: "Palisada okorowana",
      dimensions: "75 - 100 x 1650",
      m3Quantity: 21.714,
      black: 21.714,
      white: 0,
      package: 105,
      piecesQuantity: 2310,
      packagesQuantity: 22,
    },
    {
      id: 7,
      commodity: "Palisada okorowana",
      dimensions: "75 - 100 x 1650",
      m3Quantity: 21.714,
      black: 21.714,
      white: 0,
      package: 105,
      piecesQuantity: 2310,
      packagesQuantity: 22,
    },
  ];
  return (
    <TableContainer>
      <Table variant="simple" colorScheme="teal" bg="white">
        <Thead>
          <Tr>
            <Th>{t("pages.storage.table.headings.commodity")}</Th>
            <Th>{t("pages.storage.table.headings.dimensions")}</Th>
            <Th>{t("pages.storage.table.headings.m3Quantity")}</Th>
            <Th>{t("pages.storage.table.headings.black")}</Th>
            <Th>{t("pages.storage.table.headings.white")}</Th>
            <Th>{t("pages.storage.table.headings.package")}</Th>
            <Th>{t("pages.storage.table.headings.piecesQuantity")}</Th>
            <Th>{t("pages.storage.table.headings.packagesQuantity")}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {commodityStock.map((row) => (
            <Tr key={row.id}>
              <Td>{row.commodity}</Td>
              <Td>{row.dimensions}</Td>
              <Td>{String(row.m3Quantity)}</Td>
              <Td>{String(row.black)}</Td>
              <Td>{String(row.white)}</Td>
              <Td>{String(row.package)}</Td>
              <Td>{String(row.piecesQuantity)}</Td>
              <Td>{String(row.packagesQuantity)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
