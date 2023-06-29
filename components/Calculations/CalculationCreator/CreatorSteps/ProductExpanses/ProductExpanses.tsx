import { Input, Select, Flex, Text, Box, Button } from "@chakra-ui/react";
import React, { useState } from "react";
import {
  CURRENCY,
  InitialCosts,
  OrderProductInfo,
  PRODUCT_EXPANSE,
  PRODUCT_EXPANSE_TYPE,
  QUANTITY_TYPE,
} from "../../../../../lib/types";
import { useContent } from "../../../../../lib/hooks/useContent";

interface ProductExpansesProps {
  setDefaultSaturationCost: Function;
  setDefaultMarketerCost: Function;
  defaultMarketerCost: InitialCosts["marketer"];
  defaultSaturationCost: InitialCosts["saturation"];
  initialCosts: InitialCosts;
  productData: OrderProductInfo;
  currentProduct: number;
  expansesList: InitialCosts[];
  setExpansesList: Function;
  handleRateChange: React.ChangeEventHandler<HTMLInputElement>;
  handleNextStep: () => void;
  handlePrevStep: () => void;
  rate: number;
  rateDate: string | null;
  productsQuantity: number;
}

export const ProductExpanses = ({
  setDefaultSaturationCost,
  setDefaultMarketerCost,
  defaultMarketerCost,
  defaultSaturationCost,
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

  const [quantity, setQuantity] = useState(
    productData.quantity * productData.product.itemsPerPackage
  );

  const [specType, setSpecType] = useState(QUANTITY_TYPE.M3); // wyświetlany rodzaj ceny u klienta

  const [clientCostCurrency, setClientCostCurrency] = useState(1); // waluta ceny u klienta - 1 to eur (mnoży się razy 1), rate to pln

  const [clientCost, setClientCost] = useState(
    Number(productData.price) * clientCostCurrency
  );

  const [expanses, setExpanses] = useState({
    ...expansesList[currentProduct - 1],
  }); // koszty obecnego produktu

  const handleQuantityTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newQuantityType = e.target.value as QUANTITY_TYPE;
    setQuantityType(newQuantityType);
    switch (newQuantityType) {
      case QUANTITY_TYPE.PIECES:
        setQuantity(productData.quantity * productData.product.itemsPerPackage);
        break;
      case QUANTITY_TYPE.PACKAGES:
        setQuantity(productData.quantity);
        break;
      case QUANTITY_TYPE.M3:
        setQuantity(
          productData.quantity * Number(productData.product.volumePerPackage)
        );
        break;
    }
  }; // zmiana  ilości i rodzaju towaru w górnym inpucie

  const handleCostsChange = (
    e:
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLInputElement>,
    column: PRODUCT_EXPANSE_TYPE
  ) => {
    const type = e.target.name as keyof typeof initialCosts;
    setExpanses({
      ...expanses,
      [type]: {
        ...expanses[type],
        [column]: e.target.value.replace(/,/g, "."),
      },
    });
    if (type === PRODUCT_EXPANSE.SATURATION) {
      setDefaultSaturationCost({
        ...defaultSaturationCost,
        [column]: e.target.value.replace(/,/g, "."),
      });
    }
    if (type === PRODUCT_EXPANSE.MARKETER) {
      setDefaultMarketerCost({
        ...defaultMarketerCost,
        [column]: e.target.value.replace(/,/g, "."),
      });
    }
  }; // zmiana kosztów, ich waluty i rodzaju ilości towaru za który są

  const handleNext = () => {
    const newExpansesList = [...expansesList];
    newExpansesList[currentProduct - 1] = expanses;
    if (currentProduct < productsQuantity) {
      newExpansesList[currentProduct] = {
        ...newExpansesList[currentProduct],
        marketer: defaultMarketerCost,
        saturation: defaultSaturationCost,
      };
    }
    setExpansesList(newExpansesList);
    handleNextStep();
  }; // aktualizowanie ilości towarów w głównym expansesList

  const handleSpecChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const quantityType = e.target.value;
    setSpecType(quantityType as QUANTITY_TYPE);
    if (quantityType === QUANTITY_TYPE.PIECES) {
      setClientCost(
        ((Number(productData.price) *
          Number(productData.product.volumePerPackage)) /
          productData.product.itemsPerPackage) *
          clientCostCurrency
      );
    }
    if (quantityType === QUANTITY_TYPE.PACKAGES) {
      setClientCost(
        Number(productData.price) *
          Number(productData.product.volumePerPackage) *
          clientCostCurrency
      );
    }
    if (quantityType === QUANTITY_TYPE.M3) {
      setClientCost(Number(productData.price) * clientCostCurrency);
    }
  }; // zmiana wyświetlanego rodzaju ceny u klienta

  const handleClientCostCurrencyChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (
      clientCostCurrency === Number(rate) &&
      e.target.value === CURRENCY.EUR
    ) {
      setClientCostCurrency(1);
      setClientCost((prev) => prev / rate);
    }
    if (clientCostCurrency === 1 && e.target.value === CURRENCY.PLN) {
      setClientCostCurrency(Number(rate));
      setClientCost((prev) => prev * rate);
    }
  }; // zmiana wyświetlanej ceny u klienta w zależności od waluty

  return (
    <Flex
      p="24px"
      height="calc(100vh - 150px)"
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
            2. {t("pages.loads.load.products")}
          </Text>
          <Flex alignItems="center" color="var(--grey)">
            <Flex flexDir="column" mr="10px">
              <Text fontSize="15px">{t("pages.loads.load.eur-rate")}</Text>
              {rateDate && (
                <Text fontSize="11px">{`${t(
                  "pages.loads.load.from"
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
        >{`${currentProduct}. ${productData.product.category.name} ${productData.product.dimensions}`}</Text>
        <Flex alignItems="flex-end" justifyContent="space-between" mb="20px">
          <Flex flexDir="column">
            <label>{t("pages.loads.load.packing")}</label>
            <Input
              w="116px"
              defaultValue={`${productData.product.itemsPerPackage} szt.`}
              readOnly
            />
          </Flex>
          <Flex flexDir="column">
            <label>{t("pages.loads.load.quantity")}</label>
            <Input
              w="80px"
              readOnly
              value={
                quantity
                  ? quantity
                  : productData.quantity * productData.product.itemsPerPackage
              }
            />
          </Flex>
          <Select
            w="116px"
            color="black"
            onChange={handleQuantityTypeChange}
            defaultValue={quantityType}
          >
            <option value={QUANTITY_TYPE.PIECES}>
              {t("pages.loads.load.pieces")}
            </option>
            <option value={QUANTITY_TYPE.PACKAGES}>
              {t("pages.loads.load.packages")}
            </option>
            <option value={QUANTITY_TYPE.M3}>M3</option>
          </Select>
        </Flex>
        <Box mb="20px">
          <Text>{t("pages.loads.load.costs")}:</Text>
          <Flex justifyContent="space-between" mb="5px">
            <Input
              autoFocus
              type="number"
              name="commodity"
              defaultValue={
                expanses.commodity.price === 0 ? "" : expanses.commodity.price
              }
              onChange={(e) => handleCostsChange(e, PRODUCT_EXPANSE_TYPE.PRICE)}
              placeholder={t("pages.loads.load.commodity")}
              w="116px"
              p="10px"
            />
            <Select
              w="80px"
              name="commodity"
              defaultValue={expanses.commodity.currency}
              onChange={(e) =>
                handleCostsChange(e, PRODUCT_EXPANSE_TYPE.CURRENCY)
              }
            >
              <option value={CURRENCY.EUR}>EUR</option>
              <option value={CURRENCY.PLN}>PLN</option>
            </Select>
            <Select
              w="116px"
              name="commodity"
              defaultValue={expanses.commodity.quantityType}
              onChange={(e) =>
                handleCostsChange(e, PRODUCT_EXPANSE_TYPE.QUANTITY_TYPE)
              }
            >
              <option value={QUANTITY_TYPE.PIECES}>
                {t("pages.loads.load.pieces")}
              </option>
              <option value={QUANTITY_TYPE.PACKAGES}>
                {t("pages.loads.load.packages")}
              </option>
              <option value={QUANTITY_TYPE.M3}>M3</option>
            </Select>
          </Flex>
          <Flex justifyContent="space-between" mb="5px">
            <Input
              type="number"
              name="saturation"
              defaultValue={
                expanses.saturation.price === 0 ? "" : expanses.saturation.price
              }
              onChange={(e) => handleCostsChange(e, PRODUCT_EXPANSE_TYPE.PRICE)}
              placeholder={t("pages.loads.load.saturation")}
              w="116px"
              p="10px"
            />
            <Select
              w="80px"
              name="saturation"
              defaultValue={expanses.saturation.currency}
              onChange={(e) =>
                handleCostsChange(e, PRODUCT_EXPANSE_TYPE.CURRENCY)
              }
            >
              <option value={CURRENCY.EUR}>EUR</option>
              <option value={CURRENCY.PLN}>PLN</option>
            </Select>
            <Select
              w="116px"
              name="saturation"
              defaultValue={expanses.saturation.quantityType}
              onChange={(e) =>
                handleCostsChange(e, PRODUCT_EXPANSE_TYPE.QUANTITY_TYPE)
              }
            >
              <option value={QUANTITY_TYPE.PIECES}>
                {t("pages.loads.load.pieces")}
              </option>
              <option value={QUANTITY_TYPE.PACKAGES}>
                {t("pages.loads.load.packages")}
              </option>
              <option value={QUANTITY_TYPE.M3}>M3</option>
            </Select>
          </Flex>
          <Flex justifyContent="space-between" mb="5px">
            <Input
              type="number"
              name="marketer"
              defaultValue={
                expanses.marketer.price === 0 ? "" : expanses.marketer.price
              }
              onChange={(e) => handleCostsChange(e, PRODUCT_EXPANSE_TYPE.PRICE)}
              placeholder={t("pages.loads.load.marketer")}
              w="116px"
              p="10px"
            />
            <Select
              w="80px"
              name="marketer"
              defaultValue={expanses.marketer.currency}
              onChange={(e) =>
                handleCostsChange(e, PRODUCT_EXPANSE_TYPE.CURRENCY)
              }
            >
              <option value={CURRENCY.EUR}>EUR</option>
              <option value={CURRENCY.PLN}>PLN</option>
            </Select>
            <Select
              w="116px"
              name="marketer"
              defaultValue={expanses.marketer.quantityType}
              onChange={(e) =>
                handleCostsChange(e, PRODUCT_EXPANSE_TYPE.QUANTITY_TYPE)
              }
            >
              <option value={QUANTITY_TYPE.PIECES}>
                {t("pages.loads.load.pieces")}
              </option>
              <option value={QUANTITY_TYPE.PACKAGES}>
                {t("pages.loads.load.packages")}
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
              onChange={(e) => handleCostsChange(e, PRODUCT_EXPANSE_TYPE.PRICE)}
              placeholder={t("pages.loads.load.other")}
              w="116px"
              p="10px"
            />
            <Select
              w="80px"
              name="other"
              defaultValue={expanses.other.currency}
              onChange={(e) =>
                handleCostsChange(e, PRODUCT_EXPANSE_TYPE.CURRENCY)
              }
            >
              <option value={CURRENCY.EUR}>EUR</option>
              <option value={CURRENCY.PLN}>PLN</option>
            </Select>
            <Select
              w="116px"
              name="other"
              defaultValue={expanses.other.quantityType}
              onChange={(e) =>
                handleCostsChange(e, PRODUCT_EXPANSE_TYPE.QUANTITY_TYPE)
              }
            >
              <option value={QUANTITY_TYPE.PIECES}>
                {t("pages.loads.load.pieces")}
              </option>
              <option value={QUANTITY_TYPE.PACKAGES}>
                {t("pages.loads.load.packages")}
              </option>
              <option value={QUANTITY_TYPE.M3}>M3</option>
            </Select>
          </Flex>
        </Box>
        <Text>{t("pages.loads.load.client-price")}: </Text>
        <Flex justifyContent="space-between" mb="20px">
          <Input
            readOnly
            w="116px"
            value={clientCost ? clientCost.toFixed(2) : 0}
          />
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
              {t("pages.loads.load.pieces")}
            </option>
            <option value={QUANTITY_TYPE.PACKAGES}>
              {t("pages.loads.load.packages")}
            </option>
            <option value={QUANTITY_TYPE.M3}>M3</option>
          </Select>
        </Flex>
      </Box>
      <Flex justifyContent="space-between">
        <Button colorScheme="gray" w="116px" h="40px" onClick={handlePrevStep}>
          {t("buttons.back")}
        </Button>
        <Button colorScheme="green" w="116px" h="40px" onClick={handleNext}>
          {t("buttons.next")}
        </Button>
      </Flex>
    </Flex>
  );
};
