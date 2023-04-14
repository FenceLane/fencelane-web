import { Input, Select, Flex, Text, Box, Button } from "@chakra-ui/react";
import React from "react";
import { OrderProductInfo } from "../../../../../lib/types";

interface ProductExpansesProps {
  productData: OrderProductInfo;
  currentProduct: number;
  handleNextStep: React.MouseEventHandler<HTMLButtonElement>;
  handlePrevStep: React.MouseEventHandler<HTMLButtonElement>;
  rate: number;
  rateDate: string;
}

export const ProductExpanses = ({
  productData,
  currentProduct,
  handleNextStep,
  handlePrevStep,
  rate,
  rateDate,
}: ProductExpansesProps) => {
  return (
    <Flex
      p="24px"
      height="calc(100% - 50px)"
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
            2. Produkty
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
        >{`${currentProduct}. ${productData.product.category.name} ${productData.product.dimensions}`}</Text>
        <Flex alignItems="flex-end" justifyContent="space-between" mb="20px">
          <Flex flexDir="column">
            <label>Pakowanie:</label>
            <Select w="116px">
              <option>121 szt</option>
              <option></option>
            </Select>
          </Flex>
          <Flex flexDir="column">
            <label>Ilość</label>
            <Input w="70px" />
          </Flex>
          <Select w="116px">
            <option></option>
            <option></option>
          </Select>
        </Flex>
        <Box mb="20px">
          <Text>Koszty:</Text>
          <Flex justifyContent="space-between" mb="5px">
            <Input placeholder="Towar" w="116px" p="10px" />
            <Select w="80px" value="EUR">
              <option>EUR</option>
              <option>PLN</option>
            </Select>
            <Select w="116px" value="M3">
              <option>M3</option>
              <option>Sztuki</option>
              <option>Paczki</option>
            </Select>
          </Flex>
          <Flex justifyContent="space-between" mb="5px">
            <Input placeholder="Nasycanie" w="116px" p="10px" />
            <Select w="80px" value="EUR">
              <option>EUR</option>
              <option>PLN</option>
            </Select>
            <Select w="116px" value="M3">
              <option>M3</option>
              <option>Sztuki</option>
              <option>Paczki</option>
            </Select>
          </Flex>
          <Flex justifyContent="space-between" mb="5px">
            <Input placeholder="Handlowiec" w="116px" p="10px" />
            <Select w="80px" value="EUR">
              <option>EUR</option>
              <option>PLN</option>
            </Select>
            <Select w="116px" value="M3">
              <option>M3</option>
              <option>Sztuki</option>
              <option>Paczki</option>
            </Select>
          </Flex>
          <Flex justifyContent="space-between">
            <Input placeholder="Inne" w="116px" p="10px" />
            <Select w="80px" value="EUR">
              <option>EUR</option>
              <option>PLN</option>
            </Select>
            <Select w="116px" value="M3">
              <option>M3</option>
              <option>Sztuki</option>
              <option>Paczki</option>
            </Select>
          </Flex>
        </Box>
        <Text>Cena u klienta:</Text>
        <Flex justifyContent="space-between" mb="20px">
          <Input w="116px" />
          <Select w="80px" value="EUR">
            <option>EUR</option>
            <option>PLN</option>
          </Select>
          <Select w="116px" value="M3">
            <option>M3</option>
            <option>Sztuki</option>
            <option>Paczki</option>
          </Select>
        </Flex>
      </Box>
      <Flex justifyContent="space-between">
        <Button colorScheme="gray" w="116px" h="40px" onClick={handlePrevStep}>
          Cofnij
        </Button>
        <Button colorScheme="green" w="116px" h="40px" onClick={handleNextStep}>
          Dalej
        </Button>
      </Flex>
    </Flex>
  );
};
