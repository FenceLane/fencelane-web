import { Box, Flex, IconButton, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import React, { useState } from "react";
import styles from "./CalculationCreator.module.scss";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { TransportCost } from "./CreatorSteps/TransportCost/TransportCost";
import {
  OrderInfo,
  InitialCosts,
  PRODUCT_EXPANSE,
  CURRENCY,
  QUANTITY_TYPE,
} from "../../../lib/types";
import { ProductExpanses } from "./CreatorSteps/ProductExpanses/ProductExpanses";
import { Summary } from "./CreatorSteps/Summary/Summary";

interface CalculationCreatorProps {
  orderId: number;
  orderData: OrderInfo;
  rate: any;
}

export const CalculationCreator = ({
  orderId,
  orderData,
  rate,
}: CalculationCreatorProps) => {
  const productsQuantity = orderData.products.length;

  const [transportCost, setTransportCost] = useState(0);

  const [transportCostCurrency, setTransportCostCurrency] = useState("EUR");

  const [saturationCost, setSaturationCost] = useState({
    price: 0,
    currency: CURRENCY.EUR,
    costType: PRODUCT_EXPANSE.SATURATION,
    quantityType: QUANTITY_TYPE.M3,
  });

  const [marketerCost, setMarketerCost] = useState({
    price: 0,
    currency: CURRENCY.EUR,
    costType: PRODUCT_EXPANSE.MARKETER,
    quantityType: QUANTITY_TYPE.M3,
  });

  const initialCosts: InitialCosts = {
    commodity: {
      price: 0,
      currency: CURRENCY.EUR,
      costType: PRODUCT_EXPANSE.COMMODITY,
      quantityType: QUANTITY_TYPE.M3,
    },
    saturation: {
      price: 0,
      currency: CURRENCY.EUR,
      costType: PRODUCT_EXPANSE.SATURATION,
      quantityType: QUANTITY_TYPE.M3,
    },
    marketer: {
      price: 0,
      currency: CURRENCY.EUR,
      costType: PRODUCT_EXPANSE.MARKETER,
      quantityType: QUANTITY_TYPE.M3,
    },
    other: {
      price: 0,
      currency: CURRENCY.EUR,
      costType: PRODUCT_EXPANSE.OTHER,
      quantityType: QUANTITY_TYPE.M3,
    },
  } as const;

  const [expansesList, setExpansesList] = useState<InitialCosts[]>(
    Array(productsQuantity).fill(initialCosts)
  );

  const [eurRate, setEurRate] = useState(rate.mid.toFixed(2));

  const date = new Date(rate.effectiveDate);

  const [rateDate, setRateDate] = useState(
    "Z " +
      (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
      "." +
      (Number(date.getMonth()) + 1 < 10
        ? "0" + String(Number(date.getMonth()) + 1)
        : Number(date.getMonth()) + 1) +
      "." +
      date.getFullYear()
  );

  const [currentProduct, setCurrentProduct] = useState(0);

  const id = orderId.toString().padStart(4, "0");

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEurRate(e.target.value);
    setRateDate("");
  };

  const handleNextStep = () => {
    setCurrentProduct((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentProduct((prev) => prev - 1);
  };

  return (
    <Box className={styles.container} bg="white">
      <Flex alignItems="center" gap="10px">
        <Link as={NextLink} href={`/orders/${orderId}`} w="32px">
          <IconButton
            icon={<ArrowBackIcon w="32px" h="32px" />}
            aria-label="go back to order"
            w="32px"
            bg="white"
          />
        </Link>
        <Text
          color="var(--dark)"
          textTransform="uppercase"
          fontSize="18px"
          fontWeight="500"
          m="10px"
        >{`Kalkulacja do zamówienia ${id}`}</Text>
      </Flex>
      {currentProduct === 0 && (
        <TransportCost
          transportCost={transportCost}
          handleRateChange={handleRateChange}
          setTransportCost={setTransportCost}
          handleNextStep={handleNextStep}
          setTransportCostCurrency={setTransportCostCurrency}
          transportCostCurrency={transportCostCurrency}
          rate={eurRate}
          rateDate={rateDate}
        />
      )}

      {currentProduct > 0 && currentProduct <= productsQuantity && (
        <ProductExpanses
          setSaturationCost={setSaturationCost}
          saturationCost={saturationCost}
          setMarketerCost={setMarketerCost}
          marketerCost={marketerCost}
          key={currentProduct}
          initialCosts={initialCosts}
          productsQuantity={productsQuantity}
          expansesList={expansesList}
          setExpansesList={setExpansesList}
          handleRateChange={handleRateChange}
          productData={orderData.products[currentProduct - 1]}
          handleNextStep={handleNextStep}
          currentProduct={currentProduct}
          handlePrevStep={handlePrevStep}
          rate={eurRate}
          rateDate={rateDate}
        />
      )}
      {currentProduct > productsQuantity && (
        <Summary
          saturationCost={saturationCost}
          marketerCost={marketerCost}
          transportCostCurrency={transportCostCurrency}
          transportCost={transportCost}
          expansesList={expansesList}
          setExpansesList={setExpansesList}
          handleRateChange={handleRateChange}
          handlePrevStep={handlePrevStep}
          rate={eurRate}
          rateDate={rateDate}
          productData={orderData.products}
        />
      )}
    </Box>
  );
};
