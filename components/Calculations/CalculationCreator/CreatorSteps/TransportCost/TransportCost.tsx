import { Input, Select, Flex, Text, Button, Box } from "@chakra-ui/react";
import React, { useState } from "react";

interface TransportCostProps {
  setTransportCost: Function;
  transportCost: number | string;
  handleNextStep: React.MouseEventHandler<HTMLButtonElement>;
  handleRateChange: React.ChangeEventHandler<HTMLInputElement>;
  rate: number;
  rateDate: string;
}

export const TransportCost = ({
  setTransportCost,
  transportCost,
  handleNextStep,
  handleRateChange,
  rate,
  rateDate,
}: TransportCostProps) => {
  const [currency, setCurrency] = useState("EUR");

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTransportCost(e.target.value);
  };

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (transportCost === 0 || transportCost === "") {
      return;
    }
    if (currency === "PLN") {
      setTransportCost((prev: number) => (prev / rate).toFixed(2));
    }
    handleNextStep(e);
  };
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
              onChange={handleRateChange}
              type="number"
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
          <Input
            value={transportCost == 0 ? "" : transportCost}
            width="150px"
            placeholder="Transport"
            type="number"
            onInput={handleChange}
          />
          <Select width="80px" onChange={handleCurrencyChange}>
            <option value="EUR">EUR</option>
            <option value="PLN">PLN</option>
          </Select>
        </Flex>
      </Box>
      <Flex justifyContent="flex-end">
        <Button colorScheme="green" w="116px" h="40px" onClick={handleNext}>
          Dalej
        </Button>
      </Flex>
    </Flex>
  );
};
