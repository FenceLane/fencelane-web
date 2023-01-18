import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";

interface CSTypes {
  id: React.Key;
  commodity: String;
  dimensions: String;
  m3Quantity: Number;
  black: Number;
  white: Number;
  packaged: Number;
  piecesQuantity: Number;
  packagesQuantity: Number;
}
export const Storage = () => {
  const commodityStock: CSTypes[] = [
    {
      id: 1,
      commodity: "Palisada okorowana",
      dimensions: "75 - 100 x 1650",
      m3Quantity: 21.714,
      black: 21.714,
      white: 0,
      packaged: 105,
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
      packaged: 105,
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
      packaged: 105,
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
      packaged: 105,
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
      packaged: 105,
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
      packaged: 105,
      piecesQuantity: 2310,
      packagesQuantity: 22,
    },
  ];
  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th></Th>
            <Th></Th>
            <Th></Th>
            <Th></Th>
            <Th></Th>
            <Th></Th>
            <Th></Th>
            <Th></Th>
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
              <Td>{String(row.packaged)}</Td>
              <Td>{String(row.piecesQuantity)}</Td>
              <Td>{String(row.packagesQuantity)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
