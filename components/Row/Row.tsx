import React, { useState } from "react";
import { Text, Tr, Td, Button, Flex } from "@chakra-ui/react";
import { useContent } from "../../lib/hooks/useContent";
import styles from "./Row.module.scss";
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
export const Row = (props: any) => {
  const row: CSTypes = props.row;
  const [isDisplayed, setIsDisplayed] = useState(false);
  return (
    <>
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
          <Button
            w={8}
            h={8}
            bg="white"
            onClick={() => setIsDisplayed(!isDisplayed)}
          >
            <PlusSquareIcon
              w={8}
              h={8}
              color={commodityColor(row.commodity)}
            ></PlusSquareIcon>
          </Button>
        </Td>
      </Tr>
      <Tr display={isDisplayed ? "table-row" : "none"}>
        <Td colSpan={9}>
          <Flex justifyContent="right" gap="20px">
            <Button colorScheme="green">Dodaj coś tam</Button>
            <Button colorScheme="red">Usuń coś tam</Button>
            <Button colorScheme="blue">Modyfikuj coś tam</Button>
          </Flex>
        </Td>
      </Tr>
    </>
  );
};
