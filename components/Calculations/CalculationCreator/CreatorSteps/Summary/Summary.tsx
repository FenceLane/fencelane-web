import React, { useEffect, useState } from "react";
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
import {
  CURRENCY,
  InitialCosts,
  OrderProductInfo,
  QUANTITY_TYPE,
} from "../../../../../lib/types";
import { useContent } from "../../../../../lib/hooks/useContent";
import styles from "./Summary.module.scss";
import {
  usePostOrderExpanses,
  usePostOrderTransportCost,
} from "../../../../../lib/api/hooks/calcs";
import router from "next/router";

import { TransportPostInfo } from "../../../../../lib/types";
import { mapAxiosErrorToLabel } from "../../../../../lib/server/BackendError/BackendError";
import { useUpdateOrder } from "../../../../../lib/api/hooks/orders";
import { calculateProfitsPerProducts } from "../../../../../lib/util/calculationUtils";

interface SummaryProps {
  orderId: number;
  productData: OrderProductInfo[];
  handlePrevStep: React.MouseEventHandler<HTMLButtonElement>;
  handleRateChange: React.ChangeEventHandler<HTMLInputElement>;
  expansesList: InitialCosts[];
  rate: number;
  rateDate: string | null;
  transportCost: number;
  otherCosts: number;
  transportCostCurrency: string;
}

export const Summary = ({
  orderId,
  productData,
  handlePrevStep,
  handleRateChange,
  expansesList,
  rate,
  rateDate,
  otherCosts,
  transportCost,
  transportCostCurrency,
}: SummaryProps) => {
  const { t } = useContent();

  const [currency, setCurrency] = useState(CURRENCY.EUR); //waluta całego podsumowania

  const [specType, setSpecType] = useState(QUANTITY_TYPE.PACKAGES);

  const {
    mutate: postOrderExpanses,
    error: postExpansesError,
    isError: isPostExpansesError,
    isSuccess: isPostExpansesSuccess,
    isLoading: isPostExpansesLoading,
  } = usePostOrderExpanses(orderId);
  const {
    mutate: postOrderTransportCost,
    error: postTransportCostError,
    isError: isPostTransportCostError,
    isSuccess: isPostTransportCostSuccess,
    isLoading: isPostTransportCostLoading,
  } = usePostOrderTransportCost(orderId);

  const {
    mutate: updateOrder,
    error: updateOrderError,
    isError: isUpdateOrderError,
    isSuccess: isUpdateOrderSuccess,
    isLoading: isUpdateOrderLoading,
  } = useUpdateOrder(orderId);

  const transportCostInEur =
    transportCostCurrency === CURRENCY.EUR
      ? Number(otherCosts / rate) + Number(transportCost)
      : Number(transportCost / rate) + Number(otherCosts / rate);

  const transportCostPerM3 =
    transportCostInEur /
    productData.reduce(
      (acc, currentProduct) =>
        acc +
        Number(
          currentProduct.quantity *
            Number(currentProduct.product.volumePerPackage)
        ),
      0
    ); //koszt jednostkowy za jeden m3

  const initialProfit = calculateProfitsPerProducts(
    expansesList,
    productData,
    transportCostPerM3,
    rate
  );

  console.log(transportCostInEur);

  console.log(transportCostPerM3);

  console.log(otherCosts);

  const profit = initialProfit.map((profit) => {
    switch (currency) {
      case CURRENCY.EUR:
        return profit;
      case CURRENCY.PLN:
        return profit * Number(rate);
    }
  });

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value as CURRENCY);
  };

  const specTableContent = productData.map((product, key) => {
    let quantity;
    switch (specType) {
      case QUANTITY_TYPE.PACKAGES:
        quantity = product.quantity;
        break;
      case QUANTITY_TYPE.M3:
        quantity = product.quantity * Number(product.product.volumePerPackage);
        break;

      case QUANTITY_TYPE.PIECES:
        quantity = product.quantity * Number(product.product.itemsPerPackage);
        break;
    }
    let currencyMultiplier;
    switch (currency) {
      case CURRENCY.EUR:
        currencyMultiplier = 1;
        break;
      case CURRENCY.PLN:
        currencyMultiplier = Number(rate);
    }

    return {
      productName: product.product.category.name,
      productDimensions: product.product.dimensions,
      productQuantity: quantity,
      productDifference: Number(profit[key] / quantity) * currencyMultiplier,
    };
  }); // domyślna tabela z podsumowaniem (w paczkach)

  const displayProfit = profit
    .reduce((sum, value) => sum + value)
    .toFixed(2)
    .replace(/\.00$/, "");

  const handleQuantityTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSpecType(e.target.value as QUANTITY_TYPE);
  };

  const handlePostCalc = () => {
    const orderId = productData[0].orderId;
    const postExpansesList = expansesList.flatMap((expanses, key: number) => {
      return Object.values(expanses).map(
        (expanse: InitialCosts["commodity"]) => {
          let price = expanse.price;
          if (expanse.currency === CURRENCY.PLN) {
            price = expanse.price / rate;
          }
          if (expanse.quantityType === QUANTITY_TYPE.M3) {
            price = price * Number(productData[key].product.volumePerPackage);
          }
          if (expanse.quantityType == QUANTITY_TYPE.PIECES) {
            price = price * Number(productData[key].product.itemsPerPackage);
          }
          return {
            price: String(price),
            currency: CURRENCY.EUR,
            productOrderId: productData[key].productOrderId,
            type: expanse.costType,
          };
        }
      );
    });
    const postTransportData: TransportPostInfo["data"] = {
      price: String(transportCostInEur),
      currency: CURRENCY.EUR,
    };
    let postProfit = Number(displayProfit);
    if (currency === CURRENCY.PLN) {
      postProfit = Number(displayProfit) / rate;
    }
    postOrderExpanses({ id: orderId, data: postExpansesList });
    postOrderTransportCost({ id: orderId, data: postTransportData });
    updateOrder({ profit: postProfit });
  }; // wysyłanie kosztów do bazy (expansy w bazie za paczke, transportcost calkowity)

  useEffect(() => {
    if (
      isPostExpansesSuccess &&
      isPostTransportCostSuccess &&
      isUpdateOrderSuccess
    ) {
      router.push(`/orders`);
    }
  }, [
    isPostExpansesSuccess,
    isPostTransportCostSuccess,
    isUpdateOrderSuccess,
    productData,
  ]); //przy successie dodawania produktów przechodzenie do podstrony orderu

  return (
    <Flex
      height="calc(100vh - 150px)"
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
            3. {t("pages.orders.order.summary")}
          </Text>
          <Flex alignItems="center" color="var(--grey)">
            <Flex flexDir="column" mr="10px">
              <Text fontSize="15px">{t("pages.orders.order.eur-rate")}</Text>
              {rateDate && (
                <Text fontSize="11px">{`${t(
                  "pages.orders.order.from"
                )} ${rateDate}`}</Text>
              )}
            </Flex>
            <Input
              onChange={handleRateChange}
              type="number"
              padding="0"
              textAlign="center"
              width="60px"
              height="30px"
              fontSize="14px"
              defaultValue={rate}
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
          {t("pages.orders.order.currency-and-quantity-type")}
        </Text>
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
            {specTableContent.map((row, index) => (
              <Tr key={`${row.productName} ${row.productDimensions}`}>
                <Td>
                  {row.productName}
                  <br />
                  {row.productDimensions}
                </Td>
                <Td>{row.productQuantity}</Td>
                <Td>{row.productDifference.toFixed(2).replace(/\.00$/, "")}</Td>
                <Td>{profit[index].toFixed(2).replace(/\.00$/, "")}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Text mr="50px" fontWeight={500} textAlign="right">
          {t("pages.orders.order.bottom-total")}: {displayProfit} {currency}
        </Text>
      </Box>
      <Flex justifyContent="space-between">
        <Button colorScheme="gray" w="116px" h="40px" onClick={handlePrevStep}>
          {t("buttons.back")}
        </Button>
        <Button
          bg="black"
          color="white"
          w="116px"
          h="40px"
          onClick={handlePostCalc}
          isLoading={
            isPostExpansesLoading ||
            isPostTransportCostLoading ||
            isUpdateOrderLoading
          }
        >
          {t("buttons.save")}
        </Button>
      </Flex>
      {(isPostExpansesError ||
        isPostTransportCostError ||
        isUpdateOrderError) && (
        <Text color="red" fontWeight="600" fontSize="18px">
          {isPostExpansesError &&
            t(
              `errors.backendErrorLabel.${mapAxiosErrorToLabel(
                postExpansesError
              )}`
            )}
          {isPostTransportCostError &&
            t(
              `errors.backendErrorLabel.${mapAxiosErrorToLabel(
                postTransportCostError
              )}`
            )}
          {isUpdateOrderError &&
            t(
              `errors.backendErrorLabel.${mapAxiosErrorToLabel(
                updateOrderError
              )}`
            )}
        </Text>
      )}
    </Flex>
  );
};
