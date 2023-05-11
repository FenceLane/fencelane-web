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
import { useContent } from "../../../lib/hooks/useContent";

interface CalculationCreatorProps {
  orderId: number;
  orderData: OrderInfo;
  rate: any;
}

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

export const CalculationCreator = ({
  orderId,
  orderData,
  rate,
}: CalculationCreatorProps) => {
  const { t } = useContent();

  const productsQuantity = orderData.products.length;

  const [transportCost, setTransportCost] = useState(0);

  const [transportCostCurrency, setTransportCostCurrency] = useState("EUR");

  const [defaultSaturationCost, setDefaultSaturationCost] = useState({
    price: 0,
    currency: CURRENCY.EUR,
    costType: PRODUCT_EXPANSE.SATURATION,
    quantityType: QUANTITY_TYPE.M3,
  });

  const [defaultMarketerCost, setDefaultMarketerCost] = useState({
    price: 0,
    currency: CURRENCY.EUR,
    costType: PRODUCT_EXPANSE.MARKETER,
    quantityType: QUANTITY_TYPE.M3,
  });

  const [expansesList, setExpansesList] = useState<InitialCosts[]>(
    Array(productsQuantity).fill(initialCosts)
  );

  const [eurRate, setEurRate] = useState(rate.mid.toFixed(2));

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
          >{`${t("pages.orders.order.calculation-to-order")} ${id}`}</Text>
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
            setDefaultSaturationCost={setDefaultSaturationCost}
            defaultSaturationCost={defaultSaturationCost}
            setDefaultMarketerCost={setDefaultMarketerCost}
            defaultMarketerCost={defaultMarketerCost}
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
            orderId={orderId}
            transportCostCurrency={transportCostCurrency}
            transportCost={transportCost}
            expansesList={expansesList}
            handleRateChange={handleRateChange}
            handlePrevStep={handlePrevStep}
            rate={eurRate}
            rateDate={rateDate}
            productData={orderData.products}
          />
        )}
      </Box>
    </Flex>
  );
};
