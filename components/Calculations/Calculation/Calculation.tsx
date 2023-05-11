import React, { useState } from "react";
import {
  TransportInfo,
  ExpansesInfo,
  CURRENCY,
  QUANTITY_TYPE,
} from "../../../lib/types";
import {
  Flex,
  Text,
  Box,
  Input,
  Table,
  Td,
  Th,
  Tr,
  Thead,
  Tbody,
  Select,
} from "@chakra-ui/react";
import { useContent } from "../../../lib/hooks/useContent";
import styles from "./Calculation.module.scss";

interface CalculationProps {
  orderId: number;
  transportCost: TransportInfo;
  expanses: ExpansesInfo;
  rate: {
    no: string;
    effectiveDate: Date;
    mid: number;
  };
}

export const Calculation = ({
  orderId,
  transportCost,
  expanses,
  rate,
}: CalculationProps) => {
  const { t } = useContent();

  const [currency, setCurrency] = useState(CURRENCY.EUR);

  const [eurRate, setEurRate] = useState(rate.mid.toFixed(2));

  const [specType, setSpecType] = useState(QUANTITY_TYPE.PACKAGES);

  const date = new Date(rate.effectiveDate);

  const [rateDate, setRateDate] = useState(
    `${t("pages.orders.order.from")} ` +
      (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
      "." +
      (Number(date.getMonth()) + 1 < 10
        ? "0" + String(Number(date.getMonth()) + 1)
        : Number(date.getMonth()) + 1) +
      "." +
      date.getFullYear()
  );

  const id = orderId.toString().padStart(4, "0");

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEurRate(e.target.value);
    setRateDate("");
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (currency === CURRENCY.PLN && e.target.value === CURRENCY.EUR) {
      // zmiana z pln na eur
      setCurrency(CURRENCY.EUR);
    }

    if (currency === CURRENCY.EUR && e.target.value === CURRENCY.PLN) {
      //zmiana z eur na pln
      setCurrency(CURRENCY.PLN);
    }
  };

  const transportCostPerM3 =
    Number(transportCost.price) /
    Number(
      Object.values(expanses)
        .map(
          (product) =>
            product[0].productOrder.quantity *
            Number(product[0].productOrder.product.volumePerPackage)
        )
        .reduce((acc, cost) => acc + cost)
    );

  const expanseData = Object.values(expanses).map((product) => {
    let quantity;
    switch (specType) {
      case QUANTITY_TYPE.PACKAGES:
        quantity = product[0].productOrder.quantity;
        break;
      case QUANTITY_TYPE.M3:
        quantity =
          product[0].productOrder.quantity *
          Number(product[0].productOrder.product.volumePerPackage);
        break;

      case QUANTITY_TYPE.PIECES:
        quantity =
          product[0].productOrder.quantity *
          Number(product[0].productOrder.product.itemsPerPackage);
        break;
    }
    let currencyMultiplier;
    switch (currency) {
      case CURRENCY.EUR:
        currencyMultiplier = 1;
        break;
      case CURRENCY.PLN:
        currencyMultiplier = Number(eurRate);
    }
    return {
      name: product[0].productOrder.product.category.name,
      dimensions: product[0].productOrder.product.dimensions,
      quantity: quantity,
      price: product[0].productOrder.price,
      vpp: product[0].productOrder.product.volumePerPackage,
      ipp: product[0].productOrder.product.itemsPerPackage,
      totalProfitOfProduct:
        (Number(product[0].productOrder.price) *
          product[0].productOrder.quantity *
          Number(product[0].productOrder.product.volumePerPackage) -
          product.map((value) => Number(value.price)).reduce((a, b) => a + b) *
            product[0].productOrder.quantity -
          transportCostPerM3 *
            Number(product[0].productOrder.product.volumePerPackage) *
            product[0].productOrder.quantity) *
        currencyMultiplier,
    };
  });

  const handleQuantityTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSpecType(e.target.value as QUANTITY_TYPE);
  };

  return (
    <Flex flexDir="column" alignItems="center">
      <Box
        width="100%"
        height="100%"
        minHeight="85vh"
        className={styles.container}
        bg="white"
        maxWidth="700px"
        boxShadow="0px 4px 4px rgba(0, 0, 0, 0.15)"
      >
        <Flex
          height="calc(100vh - 150px)"
          p="24px"
          flexDir="column"
          // justifyContent="space-between"
          bg="white"
          maxWidth="1024px"
        >
          <Text
            color="var(--dark)"
            textTransform="uppercase"
            fontSize="18px"
            fontWeight="500"
            mb="20px"
          >{`${t("pages.orders.order.calculation-to-order")} ${id}`}</Text>
          <Box>
            <Flex justifyContent="flex-end" alignItems="center" mb="10px">
              <Flex alignItems="center" color="var(--grey)">
                <Flex flexDir="column" mr="10px">
                  <Text fontSize="15px">
                    {t("pages.orders.order.eur-rate")}
                  </Text>
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
                  defaultValue={eurRate}
                />
              </Flex>
            </Flex>
            <Flex gap="10px" mb="10px">
              <Select
                w="80px"
                defaultValue={currency}
                onChange={handleCurrencyChange}
              >
                <option value={CURRENCY.EUR}>EUR</option>
                <option value={CURRENCY.PLN}>PLN</option>
              </Select>
              <Select
                w="116px"
                defaultValue={QUANTITY_TYPE.PACKAGES}
                onChange={handleQuantityTypeChange}
              >
                <option value={QUANTITY_TYPE.PACKAGES}>
                  {t("pages.orders.order.packages")}
                </option>
                <option value={QUANTITY_TYPE.M3}>M3</option>
                <option value={QUANTITY_TYPE.PIECES}>
                  {t("pages.orders.order.pieces")}
                </option>
              </Select>
            </Flex>
            <Table className={styles["spec-table"]}>
              <Thead>
                <Tr>
                  <Th>{t("pages.orders.order.product")}</Th>
                  <Th>{t("pages.orders.order.quantity")}</Th>
                  <Th>{t("pages.orders.order.difference")}</Th>
                  <Th>{t("pages.orders.order.total")}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {expanseData.map((row, index) => (
                  <Tr key={`${row.name} ${row.dimensions}`}>
                    <Td>
                      {row.name}
                      <br />
                      {row.dimensions}
                    </Td>
                    <Td>{row.quantity}</Td>
                    <Td>
                      {(row.totalProfitOfProduct / row.quantity)
                        .toFixed(2)
                        .replace(/\.00$/, "")}
                    </Td>
                    <Td>
                      {row.totalProfitOfProduct.toFixed(2).replace(/\.00$/, "")}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Text
              className={styles["profit-text"]}
              fontWeight={500}
              textAlign="right"
              mt="20px"
            >
              {t("pages.orders.order.bottom-total")}:{" "}
              {expanseData
                .map((product) => product.totalProfitOfProduct)
                .reduce((acc, profit) => acc + profit)
                .toFixed(2)
                .replace(/\.00$/, "")}{" "}
              {currency}
            </Text>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
};
