import React from "react";
import {
  Input,
  Flex,
  Text,
  Box,
  Button,
  Select,
  Table,
  Thead,
  Tr,
  Td,
  Tbody,
  Th,
} from "@chakra-ui/react";
import { OrderProductInfo } from "../../../../../lib/types";
import { useContent } from "../../../../../lib/hooks/useContent";
import styles from "./Summary.module.scss";

interface SummaryProps {
  productData: OrderProductInfo[];
  handlePrevStep: React.MouseEventHandler<HTMLButtonElement>;
  rate: number;
  rateDate: string;
}

export const Summary = ({
  productData,
  handlePrevStep,
  rate,
  rateDate,
}: SummaryProps) => {
  const { t } = useContent();

  let specType = "pieces";

  return (
    <Flex
      height="calc(100% - 50px)"
      p="24px"
      flexDir="column"
      justifyContent="space-between"
    >
      <Box>
        <Flex justifyContent="space-between" alignItems="center" mb="10px">
          <Text
            color="var(--grey)"
            textTransform="uppercase"
            textDecoration="underline"
            fontSize="18px"
            fontWeight="600"
          >
            3. Podsumowanie
          </Text>
          <Flex alignItems="center" color="var(--grey)">
            <Flex flexDir="column" mr="10px">
              <Text fontSize="15px">Kurs EUR</Text>
              <Text fontSize="11px">{`Z ${rateDate}`}</Text>
            </Flex>
            <Input
              padding="0"
              textAlign="center"
              width="60px"
              height="30px"
              fontSize="14px"
              value={rate}
            />
          </Flex>
        </Flex>
        <Text
          color="var(--dark)"
          fontSize="14px"
          textDecoration="underline"
          textTransform="uppercase"
          fontWeight="600"
          mb="10px"
        >
          Waluta i jednostka
        </Text>
        <Flex gap="10px" mb="10px">
          <Select w="80px" value="EUR">
            <option>EUR</option>
            <option>PLN</option>
          </Select>
          <Select w="116px" value="Sztuki">
            <option>M3</option>
            <option>Sztuki</option>
            <option>Paczki</option>
          </Select>
        </Flex>

        <Table className={styles["spec-table"]}>
          <Thead>
            <Tr>
              <Th>PRODUKT</Th>
              <Th>ILOŚĆ</Th>
              <Th>RÓŻNICA</Th>
              <Th>ŁĄCZNIE</Th>
            </Tr>
          </Thead>
          <Tbody>
            {productData &&
              productData.map((product) => (
                <Tr key={product.id}>
                  <Td fontWeight={500}>
                    {product.product.category.name}
                    <br />
                    {product.product.dimensions}
                  </Td>
                  {specType == "pieces" && (
                    <>
                      <Td>
                        {product.quantity * product.product.itemsPerPackage}
                      </Td>
                      <Td>
                        {(
                          Number(product.price) /
                          (product.quantity * product.product.itemsPerPackage)
                        ).toFixed(2)}
                      </Td>
                    </>
                  )}
                  {specType == "packages" && (
                    <>
                      <Td>{product.quantity}</Td>
                      <Td>
                        {(Number(product.price) / product.quantity).toFixed(2)}
                      </Td>
                    </>
                  )}
                  {specType == "m3" && (
                    <>
                      <Td>
                        {product.quantity *
                          Number(product.product.volumePerPackage)}
                      </Td>
                      <Td>
                        {(
                          Number(product.price) /
                          (product.quantity *
                            Number(product.product.volumePerPackage))
                        ).toFixed(2)}
                      </Td>
                    </>
                  )}
                  <Td></Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </Box>
      <Flex justifyContent="space-between">
        <Button colorScheme="gray" w="116px" h="40px" onClick={handlePrevStep}>
          Cofnij
        </Button>
        <Button bg="black" color="white" w="116px" h="40px">
          Zapisz
        </Button>
      </Flex>
    </Flex>
  );
};
