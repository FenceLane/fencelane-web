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
  useUpdateStatus,
} from "../../../../../lib/api/hooks/calcs";
import router from "next/router";

import { TransportPostInfo } from "../../../../../lib/types";
import { mapAxiosErrorToLabel } from "../../../../../lib/server/BackendError/BackendError";

interface SummaryProps {
  orderId: number;
  productData: OrderProductInfo[];
  handlePrevStep: React.MouseEventHandler<HTMLButtonElement>;
  handleRateChange: React.ChangeEventHandler<HTMLInputElement>;
  expansesList: InitialCosts[];
  rate: number;
  rateDate: string;
  transportCost: number;
  transportCostCurrency: string;
}

interface SpecTableTypes {
  productName: string;
  productDimensions: string;
  productQuantity: number;
  productDifference: number;
}

export const Summary = ({
  orderId,
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

  const [currency, setCurrency] = useState("EUR"); //waluta całego podsumowania

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

  const {
    mutate: updateOrder,
    error: updateOrderError,
    isError: isUpdateOrderError,
    isSuccess: isUpdateOrderSuccess,
    isLoading: isUpdateOrderLoading,
  } = useUpdateStatus(orderId);

  const transportCostInEur =
    transportCostCurrency === CURRENCY.EUR
      ? transportCost
      : transportCost / rate;

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
    ); //koszt jednostkowy za jeden m3

  const initialProfit = [...expansesList].map((item, key: number) => {
    let summaryCost = 0;
    Object.entries(item).map((expanse) => {
      //dodawanie do sumarycznego kosztu jednej paczki wszystkich kosztów cząstkowych:
      const expanseData = expanse[1];
      let expanseCost = Number(expanseData.price);
      if (expanseData.currency === CURRENCY.PLN) {
        expanseCost = expanseCost / rate;
      }
      if (expanseData.quantityType === QUANTITY_TYPE.M3) {
        expanseCost =
          expanseCost * Number(productData[key].product.volumePerPackage);
      }
      if (expanseData.quantityType === QUANTITY_TYPE.PIECES) {
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
      productData[key].quantity; // całkowita kwota płacona przez klienta, czyli cena za 1m3 razy przelicznik m3 razy ilosc paczek
    return Number(totalPrice - summaryCost); //zarobek na 1 produkcie (za wszystkie jego paczki)
  }); // jest to tablica przechowująca całkowity profit kolejno na każdym produkcie

  const [profit, setProfit] = useState(initialProfit);

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (currency === CURRENCY.PLN && e.target.value === CURRENCY.EUR) {
      // zmiana z pln na eur
      setCurrency(e.target.value);
      setProfit(profit.map((profit: number) => profit / rate)); //aktualizowanie całkowitych profitów
      setSpecTableContent(
        specTableContent.map((row) => ({
          ...row,
          productDifference: row.productDifference / rate, //aktualizowanie różnicy w każdym produkcie
        }))
      );
    }

    if (currency === CURRENCY.EUR && e.target.value === CURRENCY.PLN) {
      //zmiana z eur na pln
      setCurrency(e.target.value);
      setProfit(profit.map((profit: number) => profit * rate));
      setSpecTableContent(
        specTableContent.map((row) => ({
          ...row,
          productDifference: row.productDifference * rate,
        }))
      );
    }
  };

  const initialSpecTableContent = productData.map((product, key) => ({
    productName: product.product.category.name,
    productDimensions: product.product.dimensions,
    productQuantity: Number(product.quantity),
    productDifference: Number(profit[key] / product.quantity),
  })); // domyślna tabela z podsumowaniem (w paczkach)

  const [specTableContent, setSpecTableContent] = useState<SpecTableTypes[]>(
    initialSpecTableContent
  );

  const displayProfit = profit
    .reduce((sum, value) => sum + value)
    .toFixed(2)
    .replace(/\.00$/, "");

  const handleQuantityTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const quantityType = e.target.value as QUANTITY_TYPE;
    const newSpecTableContent = productData.map((product, key) => {
      switch (quantityType) {
        case QUANTITY_TYPE.PIECES:
          return {
            productName: product.product.category.name,
            productDimensions: product.product.dimensions,
            productQuantity: product.quantity * product.product.itemsPerPackage,
            productDifference:
              profit[key] /
              (product.quantity * product.product.itemsPerPackage),
          };
        case QUANTITY_TYPE.PACKAGES:
          return {
            productName: product.product.category.name,
            productDimensions: product.product.dimensions,
            productQuantity: Number(product.quantity),
            productDifference: profit[key] / product.quantity,
          };
        case QUANTITY_TYPE.M3:
          return {
            productName: product.product.category.name,
            productDimensions: product.product.dimensions,
            productQuantity:
              product.quantity * Number(product.product.volumePerPackage),
            productDifference:
              profit[key] /
              (product.quantity * Number(product.product.volumePerPackage)),
          };
      }
    });
    setSpecTableContent(newSpecTableContent);
  }; // zmiana zawartości tabeli dla zmiany rodzaju ilości

  const handlePostCalc = () => {
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
            price: Number(price),
            currency: CURRENCY.EUR,
            productOrderId: productData[key].productOrderId,
            type: expanse.costType,
          };
        }
      );
    });
    const postTransportData: TransportPostInfo["data"] = {
      price: Number(transportCostInEur),
      currency: CURRENCY.EUR,
    };
    const orderId = productData[0].orderId;
    let postProfit = Number(displayProfit);
    if (currency === CURRENCY.PLN) {
      postProfit = Number(displayProfit) / rate;
    }
    console.log({ id: orderId, data: postExpansesList });
    console.log({ id: orderId, data: postTransportData });
    console.log({ profit: postProfit });
    postOrderExpanses({ id: orderId, data: postExpansesList });
    postOrderTransportCost({ id: orderId, data: postTransportData });
    updateOrder({ profit: postProfit });
  }; // wysyłanie kosztów do bazy (expansy w bazie za paczke, transportcost za m3)

  useEffect(() => {
    if (
      isPostExpansesSuccess &&
      isPostTransportCostSuccess &&
      isUpdateOrderSuccess
    ) {
      router.push(`/orders/${productData[0].orderId}`);
    }
  }, [
    isPostExpansesSuccess,
    isPostTransportCostSuccess,
    isUpdateOrderSuccess,
    productData,
  ]); //przy successie dodawania produktów przechodzenie do podstrony orderu

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
            <option value={CURRENCY.EUR}>EUR</option>
            <option value={CURRENCY.PLN}>PLN</option>
          </Select>
          <Select
            w="116px"
            defaultValue={QUANTITY_TYPE.PACKAGES}
            onChange={handleQuantityTypeChange}
          >
            <option value={QUANTITY_TYPE.PACKAGES}>Paczki</option>
            <option value={QUANTITY_TYPE.M3}>M3</option>
            <option value={QUANTITY_TYPE.PIECES}>Sztuki</option>
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
          RAZEM: {displayProfit} {currency}
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
          isLoading={
            isPostExpansesLoading ||
            isPostTransportCostLoading ||
            isUpdateOrderLoading
          }
        >
          Zapisz
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
