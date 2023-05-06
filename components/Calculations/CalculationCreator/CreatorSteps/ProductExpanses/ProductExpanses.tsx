import { Input, Select, Flex, Text, Box, Button } from "@chakra-ui/react";
import React, { useState } from "react";
import {
  CURRENCY,
  InitialCosts,
  OrderProductInfo,
  PRODUCT_EXPANSE,
  QUANTITY_TYPE,
} from "../../../../../lib/types";
import { useContent } from "../../../../../lib/hooks/useContent";

interface ProductExpansesProps {
  setSaturationCost: Function;
  setMarketerCost: Function;
  marketerCost: InitialCosts["marketer"];
  saturationCost: InitialCosts["saturation"];
  initialCosts: InitialCosts;
  productData: OrderProductInfo;
  currentProduct: number;
  expansesList: InitialCosts[];
  setExpansesList: Function;
  handleRateChange: React.ChangeEventHandler<HTMLInputElement>;
  handleNextStep: React.MouseEventHandler<HTMLButtonElement>;
  handlePrevStep: React.MouseEventHandler<HTMLButtonElement>;
  rate: number;
  rateDate: string;
  productsQuantity: number;
}

export const ProductExpanses = ({
  setSaturationCost,
  setMarketerCost,
  marketerCost,
  saturationCost,
  initialCosts,
  expansesList,
  productData,
  currentProduct,
  setExpansesList,
  handleRateChange,
  handleNextStep,
  handlePrevStep,
  rate,
  rateDate,
  productsQuantity,
}: ProductExpansesProps) => {
  const { t } = useContent();

  const [quantityType, setQuantityType] = useState(QUANTITY_TYPE.PIECES); // wyświetlana ilość w górnym inputcie

  const [specType, setSpecType] = useState(QUANTITY_TYPE.M3); // wyświetlany rodzaj ceny u klienta

  const [clientCostCurrency, setClientCostCurrency] = useState(1); // waluta ceny u klienta - 1 to eur (mnoży się razy 1), rate to pln

  const [expanses, setExpanses] = useState(
    () => expansesList[currentProduct - 1]
  ); // koszty obecnego produktu

  const handleQuantityTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setQuantityType(e.target.value as QUANTITY_TYPE);
  }; // zmiana rodzaju ilości towaru w górnym inpucie

  const handleCostsChange = (
    e:
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLInputElement>,
    column: string
  ) => {
    const type = e.target.name as keyof typeof initialCosts;
    setExpanses({
      ...expanses,
      [type]: { ...expanses[type], [column]: e.target.value },
    });
    if (type === PRODUCT_EXPANSE.SATURATION) {
      setSaturationCost({
        ...saturationCost,
        [column]: e.target.value,
      });
    }
    if (type === PRODUCT_EXPANSE.MARKETER) {
      setMarketerCost({
        ...marketerCost,
        [column]: e.target.value,
      });
    }
  }; // zmiana kosztów, ich waluty i rodzaju ilości towaru za który są

  const handleNext = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const newExpansesList = [...expansesList];
    newExpansesList[currentProduct - 1] = expanses;
    setExpansesList(newExpansesList);
    handleNextStep(e);
  }; // aktualizowanie ilości towarów w głównym expansesList

  const handlePrev = (e: React.MouseEvent<HTMLButtonElement>) => {
    handlePrevStep(e);
  };

  const handleSpecChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSpecType(e.target.value as QUANTITY_TYPE);
  }; // zmiana wyświetlanego rodzaju ceny u klienta

  const handleClientCostCurrencyChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (e.target.value === CURRENCY.EUR) {
      setClientCostCurrency(1);
    }
    if (e.target.value === CURRENCY.PLN) {
      setClientCostCurrency(Number(rate));
    }
  }; // zmiana wyświetlanej ceny u klienta w zależności od waluty

  return (
    <Flex
      p="24px"
      height="calc(100% - 50px)"
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
            2. Produkty
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
        >{`${currentProduct}. ${productData.product.category.name} ${productData.product.dimensions}`}</Text>
        <Flex alignItems="flex-end" justifyContent="space-between" mb="20px">
          <Flex flexDir="column">
            <label>Pakowanie:</label>
            <Input
              w="116px"
              defaultValue={`${productData.product.itemsPerPackage} szt.`}
              readOnly
            />
          </Flex>
          <Flex flexDir="column">
            <label>Ilość</label>
            {quantityType == QUANTITY_TYPE.PIECES && (
              <Input
                w="100px"
                readOnly
                defaultValue={
                  productData.quantity * productData.product.itemsPerPackage
                }
              />
            )}
            {quantityType == QUANTITY_TYPE.PACKAGES && (
              <Input w="100px" readOnly defaultValue={productData.quantity} />
            )}
            {quantityType == QUANTITY_TYPE.M3 && (
              <Input
                w="100px"
                readOnly
                defaultValue={
                  productData.quantity *
                  Number(productData.product.volumePerPackage)
                }
              />
            )}
          </Flex>
          <Select
            w="116px"
            color="black"
            onChange={handleQuantityTypeChange}
            defaultValue={quantityType}
          >
            <option value={QUANTITY_TYPE.PIECES}>
              {t("pages.orders.order.pieces")}
            </option>
            <option value={QUANTITY_TYPE.PACKAGES}>
              {t("pages.orders.order.packages")}
            </option>
            <option value={QUANTITY_TYPE.M3}>M3</option>
          </Select>
        </Flex>
        <Box mb="20px">
          <Text>Koszty:</Text>
          <Flex justifyContent="space-between" mb="5px">
            <Input
              autoFocus
              type="number"
              name="commodity"
              defaultValue={
                expanses.commodity.price == 0 ? "" : expanses.commodity.price
              }
              onChange={(e) => handleCostsChange(e, "price")}
              placeholder="Towar"
              w="116px"
              p="10px"
            />
            <Select
              w="80px"
              name="commodity"
              defaultValue={expanses.commodity.currency}
              onChange={(e) => handleCostsChange(e, "currency")}
            >
              <option value={CURRENCY.EUR}>EUR</option>
              <option value={CURRENCY.PLN}>PLN</option>
            </Select>
            <Select
              w="116px"
              name="commodity"
              defaultValue={expanses.commodity.quantityType}
              onChange={(e) => handleCostsChange(e, "quantityType")}
            >
              <option value={QUANTITY_TYPE.PIECES}>
                {t("pages.orders.order.pieces")}
              </option>
              <option value={QUANTITY_TYPE.PACKAGES}>
                {t("pages.orders.order.packages")}
              </option>
              <option value={QUANTITY_TYPE.M3}>M3</option>
            </Select>
          </Flex>
          <Flex justifyContent="space-between" mb="5px">
            <Input
              type="number"
              name="saturation"
              defaultValue={
                saturationCost.price == 0 ? "" : saturationCost.price
              }
              onChange={(e) => handleCostsChange(e, "price")}
              placeholder="Nasycanie"
              w="116px"
              p="10px"
            />
            <Select
              w="80px"
              name="saturation"
              defaultValue={saturationCost.currency}
              onChange={(e) => handleCostsChange(e, "currency")}
            >
              <option value={CURRENCY.EUR}>EUR</option>
              <option value={CURRENCY.PLN}>PLN</option>
            </Select>
            <Select
              w="116px"
              name="saturation"
              defaultValue={saturationCost.quantityType}
              onChange={(e) => handleCostsChange(e, "quantityType")}
            >
              <option value={QUANTITY_TYPE.PIECES}>
                {t("pages.orders.order.pieces")}
              </option>
              <option value={QUANTITY_TYPE.PACKAGES}>
                {t("pages.orders.order.packages")}
              </option>
              <option value={QUANTITY_TYPE.M3}>M3</option>
            </Select>
          </Flex>
          <Flex justifyContent="space-between" mb="5px">
            <Input
              type="number"
              name="marketer"
              defaultValue={marketerCost.price == 0 ? "" : marketerCost.price}
              onChange={(e) => handleCostsChange(e, "price")}
              placeholder="Handlowiec"
              w="116px"
              p="10px"
            />
            <Select
              w="80px"
              name="marketer"
              defaultValue={marketerCost.currency}
              onChange={(e) => handleCostsChange(e, "currency")}
            >
              <option value={CURRENCY.EUR}>EUR</option>
              <option value={CURRENCY.PLN}>PLN</option>
            </Select>
            <Select
              w="116px"
              name="marketer"
              defaultValue={marketerCost.quantityType}
              onChange={(e) => handleCostsChange(e, "quantityType")}
            >
              <option value={QUANTITY_TYPE.PIECES}>
                {t("pages.orders.order.pieces")}
              </option>
              <option value={QUANTITY_TYPE.PACKAGES}>
                {t("pages.orders.order.packages")}
              </option>
              <option value={QUANTITY_TYPE.M3}>M3</option>
            </Select>
          </Flex>
          <Flex justifyContent="space-between">
            <Input
              type="number"
              name="other"
              defaultValue={
                expanses.other.price == 0 ? "" : expanses.other.price
              }
              onChange={(e) => handleCostsChange(e, "price")}
              placeholder="Inne"
              w="116px"
              p="10px"
            />
            <Select
              w="80px"
              name="other"
              defaultValue={expanses.other.currency}
              onChange={(e) => handleCostsChange(e, "currency")}
            >
              <option value={CURRENCY.EUR}>EUR</option>
              <option value={CURRENCY.PLN}>PLN</option>
            </Select>
            <Select
              w="116px"
              name="other"
              defaultValue={expanses.other.quantityType}
              onChange={(e) => handleCostsChange(e, "quantityType")}
            >
              <option value={QUANTITY_TYPE.PIECES}>
                {t("pages.orders.order.pieces")}
              </option>
              <option value={QUANTITY_TYPE.PACKAGES}>
                {t("pages.orders.order.packages")}
              </option>
              <option value={QUANTITY_TYPE.M3}>M3</option>
            </Select>
          </Flex>
        </Box>
        <Text>Cena u klienta:</Text>
        <Flex justifyContent="space-between" mb="20px">
          {specType === QUANTITY_TYPE.PIECES && (
            <Input
              readOnly
              w="116px"
              defaultValue={(
                ((Number(productData.price) *
                  Number(productData.product.volumePerPackage)) /
                  productData.product.itemsPerPackage) *
                clientCostCurrency
              ).toFixed(2)}
            />
          )}
          {specType === QUANTITY_TYPE.PACKAGES && (
            <Input
              readOnly
              w="116px"
              defaultValue={(
                Number(productData.price) *
                Number(productData.product.volumePerPackage) *
                clientCostCurrency
              ).toFixed(2)}
            />
          )}
          {specType === QUANTITY_TYPE.M3 && (
            <Input
              readOnly
              w="116px"
              defaultValue={(
                Number(productData.price) * clientCostCurrency
              ).toFixed(2)}
            />
          )}
          <Select
            w="80px"
            defaultValue={CURRENCY.EUR}
            onChange={handleClientCostCurrencyChange}
          >
            <option value={CURRENCY.EUR}>EUR</option>
            <option value={CURRENCY.PLN}>PLN</option>
          </Select>
          <Select
            w="120px"
            color="black"
            onChange={handleSpecChange}
            defaultValue={specType}
          >
            <option value={QUANTITY_TYPE.PIECES}>
              {t("pages.orders.order.pieces")}
            </option>
            <option value={QUANTITY_TYPE.PACKAGES}>
              {t("pages.orders.order.packages")}
            </option>
            <option value={QUANTITY_TYPE.M3}>M3</option>
          </Select>
        </Flex>
      </Box>
      <Flex justifyContent="space-between">
        <Button colorScheme="gray" w="116px" h="40px" onClick={handlePrev}>
          Cofnij
        </Button>
        <Button colorScheme="green" w="116px" h="40px" onClick={handleNext}>
          Dalej
        </Button>
      </Flex>
    </Flex>
  );
};
