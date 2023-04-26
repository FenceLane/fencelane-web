import { Box, Flex, IconButton, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import React, { useState } from "react";
import styles from "./CalculationCreator.module.scss";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { TransportCost } from "./CreatorSteps/TransportCost/TransportCost";
import { OrderInfo } from "../../../lib/types";
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
  const [transportCost, setTransportCost] = useState(0);

  const [expansesList, setExpansesList] = useState([]);

  const [eurRate, setEurRate] = useState(rate.mid.toFixed(2));

  const date = new Date(rate.effectiveDate);

  const rateDate =
    (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
    "." +
    (Number(date.getMonth()) + 1 < 10
      ? "0" + String(Number(date.getMonth()) + 1)
      : Number(date.getMonth()) + 1) +
    "." +
    date.getFullYear();

  const productsQuantity = orderData.products.length;

  const [currentProduct, setCurrentProduct] = useState(0);

  const id = orderId.toString().padStart(4, "0");

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEurRate(e.target.value);
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
          rate={eurRate}
          rateDate={rateDate}
        />
      )}

      {currentProduct > 0 && currentProduct <= productsQuantity && (
        <ProductExpanses
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
          expansesList={expansesList}
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
