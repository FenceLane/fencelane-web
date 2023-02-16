import React, { useState } from "react";
import { Text, Tr, Td, Button, Flex, ScaleFade } from "@chakra-ui/react";
import styles from "./Row.module.scss";
import { PlusSquareIcon } from "@chakra-ui/icons";

const commodityColor = (commodity: String) => {
  if (commodity === "Palisada okorowana") return "#805AD5";
  if (commodity === "Palisada cylindryczna") return "#D53F8C";
  if (commodity === "Palisada nieokorowana") return "#DBC234";
  if (commodity === "Palisada prostokątna") return "#38A169";
  if (commodity === "Słupek bramowy") return "#EF7F18";
};
interface CSTypes {
  id: React.Key;
  name: String;
  dimensions: String;
  volumePerPackage: Number;
  black: Number;
  white: Number;
  itemsPerPackage: Number;
  pieces: Number;
  stock: Number;
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
            bg={commodityColor(row.name)}
            color="white"
            p="3px 6px"
            borderRadius="6px"
            textAlign="center"
          >
            {row.name}
          </Text>
        </Td>
        <Td>{row.dimensions}</Td>
        <Td>{String(row.volumePerPackage)}</Td>
        <Td>{String(row.black)}</Td>
        <Td>{String(row.white)}</Td>
        <Td>{String(row.itemsPerPackage)}</Td>
        <Td>{String(row.pieces)}</Td>
        <Td>{String(row.stock)}</Td>
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
              color={commodityColor(row.name)}
            ></PlusSquareIcon>
          </Button>
        </Td>
      </Tr>
      <Tr
        display={isDisplayed ? "table-row" : "none"}
        className={styles["bottom-row"]}
      >
        <Td colSpan={9}>
          <ScaleFade initialScale={1.5} in={isDisplayed}>
            <Flex justifyContent="right" gap="20px">
              <Button colorScheme="green">Dodaj coś tam</Button>
              <Button colorScheme="red">Usuń coś tam</Button>
              <Button colorScheme="blue">Modyfikuj coś tam</Button>
            </Flex>
          </ScaleFade>
        </Td>
      </Tr>
    </>
  );
};
