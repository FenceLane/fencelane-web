import { Input, Select, Flex, Text, Button, Box } from "@chakra-ui/react";
import React from "react";

interface TransportCostProps {
  handleNextStep: React.MouseEventHandler<HTMLButtonElement>;
  rate: number;
  rateDate: string;
}

export const TransportCost = ({
  handleNextStep,
  rate,
  rateDate,
}: TransportCostProps) => {
  return (
    <Flex
      height="calc(100% - 50px)"
      p="24px"
      flexDir="column"
      justifyContent="space-between"
    >
      <Box>
        <Flex justifyContent="space-between" alignItems="center">
          <Text
            color="var(--grey)"
            textTransform="uppercase"
            textDecoration="underline"
            fontSize="18px"
            fontWeight="600"
          >
            1. Cena dostawy
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
        <Flex justifyContent="space-between" mt="20px">
          <Input width="150px" placeholder="Transport" type="number" />
          <Select width="80px">
            <option value="EUR">EUR</option>
            <option value="PLN">PLN</option>
          </Select>
        </Flex>
      </Box>
      <Flex justifyContent="flex-end">
        <Button colorScheme="green" w="116px" h="40px" onClick={handleNextStep}>
          Dalej
        </Button>
      </Flex>
    </Flex>
  );
};
