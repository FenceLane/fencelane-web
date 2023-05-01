import { Input, Select, Flex, Text, Box, Button } from "@chakra-ui/react";
import React, { useState } from "react";
import { InitialCosts, OrderProductInfo } from "../../../../../lib/types";
import { useContent } from "../../../../../lib/hooks/useContent";

interface InitialCostsProps {
  commodity: {
    price: number;
    currency: string;
    costType: string;
    quantityType: string;
  };
  saturation: {
    price: number;
    currency: string;
    costType: string;
    quantityType: string;
  };
  marketer: {
    price: number;
    currency: string;
    costType: string;
    quantityType: string;
  };
  other: {
    price: number;
    currency: string;
    costType: string;
    quantityType: string;
  };
}
[];

interface ProductExpansesProps {
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

  const [quantityType, setQuantityType] = useState("pieces");

  const disexpans = expansesList[currentProduct - 1];

  const [expanses, setExpanses] = useState(
    () => expansesList[currentProduct - 1]
  );

  const handleQuantityTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setQuantityType(e.target.value);
  };

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
  };

  const handleNext = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const newExpansesList = [...expansesList];
    newExpansesList[currentProduct - 1] = expanses;
    setExpansesList(newExpansesList);
    handleNextStep(e);
  };

  const handlePrev = (e: React.MouseEvent<HTMLButtonElement>) => {
    handlePrevStep(e);
  };

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
            {quantityType == "pieces" && (
              <Input
                w="100px"
                readOnly
                defaultValue={
                  productData.quantity * productData.product.itemsPerPackage
                }
              />
            )}
            {quantityType == "packages" && (
              <Input w="100px" readOnly defaultValue={productData.quantity} />
            )}
            {quantityType == "m3" && (
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
            <option value="pieces">{t("pages.orders.order.pieces")}</option>
            <option value="packages">{t("pages.orders.order.packages")}</option>
            <option value="m3">M3</option>
          </Select>
        </Flex>
        <Box mb="20px">
          <Text>Koszty:</Text>
          <Flex justifyContent="space-between" mb="5px">
            <Input
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
              <option>EUR</option>
              <option>PLN</option>
            </Select>
            <Select
              w="116px"
              name="commodity"
              defaultValue={expanses.commodity.quantityType}
              onChange={(e) => handleCostsChange(e, "quantityType")}
            >
              <option value="pieces">Sztuki</option>
              <option value="packages">Paczki</option>
              <option value="m3">M3</option>
            </Select>
          </Flex>
          <Flex justifyContent="space-between" mb="5px">
            <Input
              type="number"
              name="saturation"
              defaultValue={
                expanses.saturation.price == 0 ? "" : expanses.saturation.price
              }
              onChange={(e) => handleCostsChange(e, "price")}
              placeholder="Nasycanie"
              w="116px"
              p="10px"
            />
            <Select
              w="80px"
              name="saturation"
              defaultValue={expanses.saturation.currency}
              onChange={(e) => handleCostsChange(e, "currency")}
            >
              <option>EUR</option>
              <option>PLN</option>
            </Select>
            <Select
              w="116px"
              name="saturation"
              defaultValue={expanses.saturation.quantityType}
              onChange={(e) => handleCostsChange(e, "quantityType")}
            >
              <option value="pieces">Sztuki</option>
              <option value="packages">Paczki</option>
              <option value="m3">M3</option>
            </Select>
          </Flex>
          <Flex justifyContent="space-between" mb="5px">
            <Input
              type="number"
              name="marketer"
              defaultValue={
                expanses.marketer.price == 0 ? "" : expanses.marketer.price
              }
              onChange={(e) => handleCostsChange(e, "price")}
              placeholder="Handlowiec"
              w="116px"
              p="10px"
            />
            <Select
              w="80px"
              name="marketer"
              defaultValue={expanses.marketer.currency}
              onChange={(e) => handleCostsChange(e, "currency")}
            >
              <option>EUR</option>
              <option>PLN</option>
            </Select>
            <Select
              w="116px"
              name="marketer"
              defaultValue={expanses.marketer.quantityType}
              onChange={(e) => handleCostsChange(e, "quantityType")}
            >
              <option value="pieces">Sztuki</option>
              <option value="packages">Paczki</option>
              <option value="m3">M3</option>
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
              <option>EUR</option>
              <option>PLN</option>
            </Select>
            <Select
              w="116px"
              name="other"
              defaultValue={expanses.other.quantityType}
              onChange={(e) => handleCostsChange(e, "quantityType")}
            >
              <option value="pieces">Sztuki</option>
              <option value="packages">Paczki</option>
              <option value="m3">M3</option>
            </Select>
          </Flex>
        </Box>
        <Text>Cena u klienta:</Text>
        <Flex justifyContent="space-between" mb="20px">
          <Input w="116px" />
          <Select w="80px" defaultValue="EUR">
            <option>EUR</option>
            <option>PLN</option>
          </Select>
          <Select w="116px" defaultValue="M3">
            <option>M3</option>
            <option>Sztuki</option>
            <option>Paczki</option>
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
