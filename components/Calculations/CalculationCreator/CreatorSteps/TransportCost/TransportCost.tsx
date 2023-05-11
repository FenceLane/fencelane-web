import { Input, Select, Flex, Text, Button, Box } from "@chakra-ui/react";
import React from "react";
import { CURRENCY } from "../../../../../lib/types";
import { useContent } from "../../../../../lib/hooks/useContent";

interface TransportCostProps {
  setTransportCost: Function;
  transportCost: number | string;
  handleNextStep: React.MouseEventHandler<HTMLButtonElement>;
  handleRateChange: React.ChangeEventHandler<HTMLInputElement>;
  setTransportCostCurrency: Function;
  transportCostCurrency: string;
  rate: number;
  rateDate: string;
}

export const TransportCost = ({
  setTransportCost,
  transportCost,
  handleNextStep,
  handleRateChange,
  setTransportCostCurrency,
  transportCostCurrency,
  rate,
  rateDate,
}: TransportCostProps) => {
  const { t } = useContent();

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTransportCostCurrency(e.target.value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTransportCost(e.target.value.replace(/,/g, "."));
  };

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (transportCost === 0 || transportCost === "") {
      return;
    }
    handleNextStep(e);
  };
  return (
    <Flex flexDir="column" justifyContent="center">
      <Flex
        width="100%"
        height="calc(100vh - 150px)"
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
              1. {t("pages.orders.order.transport-cost")}
            </Text>
            <Flex alignItems="center" color="var(--grey)">
              <Flex flexDir="column" mr="10px">
                <Text fontSize="15px">{t("pages.orders.order.eur-rate")}</Text>
                {rateDate !== "" && <Text fontSize="11px">{rateDate}</Text>}
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
              defaultValue={transportCost == 0 ? "" : transportCost}
              width="150px"
              placeholder="Transport"
              type="number"
              onInput={handleChange}
              autoFocus
            />
            <Select
              width="80px"
              onChange={handleCurrencyChange}
              defaultValue={transportCostCurrency}
            >
              <option value={CURRENCY.EUR}>EUR</option>
              <option value={CURRENCY.PLN}>PLN</option>
            </Select>
          </Flex>
        </Box>
        <Flex justifyContent="flex-end">
          <Button colorScheme="green" w="116px" h="40px" onClick={handleNext}>
            {t("buttons.next")}
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};
