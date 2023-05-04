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
import { CURRENCY, OrderProductInfo } from "../../../../../lib/types";
import { useContent } from "../../../../../lib/hooks/useContent";
import styles from "./Summary.module.scss";
import {
  usePostOrderExpanses,
  usePostOrderTransportCost,
} from "../../../../../lib/api/hooks/calcs";
import router from "next/router";

import { TransportPostInfo } from "../../../../../lib/types";
import { mapAxiosErrorToLabel } from "../../../../../lib/server/BackendError/BackendError";

interface SummaryProps {
  productData: OrderProductInfo[];
  handlePrevStep: React.MouseEventHandler<HTMLButtonElement>;
  handleRateChange: React.ChangeEventHandler<HTMLInputElement>;
  expansesList: any;
  rate: number;
  rateDate: string;
  transportCost: number;
  transportCostCurrency: string;
}

export const Summary = ({
  productData,
  handlePrevStep,
  handleRateChange,
  expansesList,
  rate,
  rateDate,
  transportCost,
  transportCostCurrency,
}: SummaryProps) => {
  const { t } = useContent();

  const [quantityType, setQuantityType] = useState("pieces");

  const [currency, setCurrency] = useState("EUR");

  const {
    mutate: postOrderExpanses,
    error: postExpansesError,
    isError: isPostExpansesError,
    isSuccess: isPostExpansesSuccess,
    isLoading: isPostExpansesLoading,
  } = usePostOrderExpanses(() => console.log("expanses success"));
  const {
    mutate: postOrderTransportCost,
    error: postTransportCostError,
    isError: isPostTransportCostError,
    isSuccess: isPostTransportCostSuccess,
    isLoading: isPostTransportCostLoading,
  } = usePostOrderTransportCost(() => console.log("transport cost success"));

  const transportCostInEur =
    transportCostCurrency === "EUR" ? transportCost : transportCost / rate;

  const transportCostPerM3 =
    transportCostInEur /
    productData.reduce(
      (acc, currentProduct: any) =>
        acc +
        Number(
          currentProduct.quantity *
            Number(currentProduct.product.volumePerPackage)
        ),
      0
    );

  let initialProfit = [...expansesList].map((item, key: number) => {
    let summaryCost = 0;
    Object.entries(item).map((expanse: any) => {
      //dodawanie do sumarycznego kosztu jednej paczki wszystkich kosztów:
      const expanseData = expanse[1];
      let expanseCost = Number(expanseData.price);
      if (expanseData.currency == "PLN") {
        expanseCost = expanseCost / rate;
      }
      if (expanseData.quantityType == "m3") {
        expanseCost =
          expanseCost * Number(productData[key].product.volumePerPackage);
      }
      if (expanseData.quantityType == "pieces") {
        expanseCost =
          expanseCost * Number(productData[key].product.itemsPerPackage);
      }
      summaryCost += expanseCost;
    });
    summaryCost +=
      transportCostPerM3 * Number(productData[key].product.volumePerPackage); // koszty i cena transportu produktu za jedna paczke
    summaryCost *= productData[key].quantity; // wszystkie koszty tego produktu (za całość)
    const totalPrice =
      Number(productData[key].price) *
      Number(productData[key].product.volumePerPackage) *
      productData[key].quantity; // całkowita kwota płacona przez klienta
    return Number(totalPrice - summaryCost); //zarobek na 1 produkcie (za wszystkie paczki)
  });

  const [profit, setProfit] = useState(initialProfit);

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (currency === "PLN" && e.target.value === "EUR") {
      setCurrency(e.target.value);
      setProfit(profit.map((profit: number) => profit / rate));
      console.log("pln na eur");
    }

    if (currency === "EUR" && e.target.value === "PLN") {
      setCurrency(e.target.value);
      setProfit(profit.map((profit: number) => profit * rate));
      console.log("eur na pln");
    }
    console.log(profit);
  };

  const handleQuantityTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setQuantityType(e.target.value);
  };

  const handlePostCalc = () => {
    const postExpansesList = expansesList.flatMap(
      (expanses: any, key: number) => {
        return Object.values(expanses).map((expanse: any) => {
          let price = expanse.price;
          if (expanse.currency === "PLN") {
            price = expanse.price / rate;
          }

          if (expanse.quantityType == "m3") {
            price = price * Number(productData[key].product.volumePerPackage);
          }
          if (expanse.quantityType == "pieces") {
            price = price * Number(productData[key].product.itemsPerPackage);
          }
          return {
            price: Number(price),
            currency: "EUR",
            productOrderId: productData[key].productOrderId,
            type: expanse.costType,
          };
        });
      }
    );
    const postTransportData: TransportPostInfo["data"] = {
      price: Number(transportCostInEur),
      currency: CURRENCY.EUR,
    };
    const orderId = productData[0].orderId;
    // console.log({ id: orderId, data: postExpansesList });
    postOrderExpanses({ id: orderId, data: postExpansesList });
    postOrderTransportCost({ id: orderId, data: postTransportData });
  };

  useEffect(() => {
    if (isPostExpansesSuccess && isPostTransportCostSuccess) {
      router.push(`/orders/${productData[0].orderId}`);
    }
  }, [isPostExpansesSuccess, isPostTransportCostSuccess, productData]);

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
          Waluta i jednostka
        </Text>
        <Flex gap="10px" mb="10px">
          <Select
            w="80px"
            defaultValue={currency}
            onChange={handleCurrencyChange}
          >
            <option value="EUR">EUR</option>
            <option value="PLN">PLN</option>
          </Select>
          <Select
            w="116px"
            defaultValue={quantityType}
            onChange={handleQuantityTypeChange}
          >
            <option value="packages">Paczki</option>
            <option value="m3">M3</option>
            <option value="pieces">Sztuki</option>
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
              productData.map((product, key) => (
                <Tr key={product.id}>
                  <Td fontWeight={500}>
                    {product.product.category.name}
                    <br />
                    {product.product.dimensions}
                  </Td>
                  {quantityType == "pieces" && (
                    <>
                      <Td>
                        {product.quantity * product.product.itemsPerPackage}
                      </Td>
                      <Td>
                        {(
                          profit[key] /
                          (product.quantity * product.product.itemsPerPackage)
                        ).toFixed(2)}
                      </Td>
                    </>
                  )}
                  {quantityType == "packages" && (
                    <>
                      <Td>{product.quantity}</Td>
                      <Td>{(profit[key] / product.quantity).toFixed(2)}</Td>
                    </>
                  )}
                  {quantityType == "m3" && (
                    <>
                      <Td>
                        {product.quantity *
                          Number(product.product.volumePerPackage)}
                      </Td>
                      <Td>
                        {(
                          profit[key] /
                          (product.quantity *
                            Number(product.product.volumePerPackage))
                        ).toFixed(2)}
                      </Td>
                    </>
                  )}
                  <Td>{profit[key].toFixed(2)}</Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
        <Text mr="50px" fontWeight={500} textAlign="right">
          RAZEM: {profit.reduce((sum, value) => sum + value).toFixed(2)}
        </Text>
      </Box>
      <Flex justifyContent="space-between">
        <Button colorScheme="gray" w="116px" h="40px" onClick={handlePrevStep}>
          Cofnij
        </Button>
        <Button
          bg="black"
          color="white"
          w="116px"
          h="40px"
          onClick={handlePostCalc}
          isLoading={isPostExpansesLoading || isPostTransportCostLoading}
        >
          Zapisz
        </Button>
      </Flex>
      {(isPostExpansesError || isPostTransportCostError) && (
        <Text color="red" fontWeight="600" fontSize="18px">
          {t(
            `errors.backendErrorLabel.${mapAxiosErrorToLabel(
              postExpansesError
            )} ${mapAxiosErrorToLabel(postTransportCostError)}`
          )}
        </Text>
      )}
    </Flex>
  );
};
