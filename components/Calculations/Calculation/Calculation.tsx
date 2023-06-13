import React, { useEffect, useState } from "react";
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { useContent } from "../../../lib/hooks/useContent";
import styles from "./Calculation.module.scss";
import {
  useDeleteExpanses,
  useDeleteTransportCost,
} from "../../../lib/api/hooks/calcs";
import { useUpdateOrder } from "../../../lib/api/hooks/orders";
import router from "next/router";
import { mapAxiosErrorToLabel } from "../../../lib/server/BackendError/BackendError";
import { constructRateDate } from "../../../lib/util/dateUtils";
import {
  customExpanseDataToCalculation,
  transportCostPerM3ToCalculation,
} from "../../../lib/util/calculationUtils";

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

  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    mutate: deleteExpanses,
    error: deleteExpansesError,
    isError: isDeleteExpansesError,
    isSuccess: isDeleteExpansesSuccess,
    isLoading: isDeleteExpansesLoading,
  } = useDeleteExpanses(orderId);

  const {
    mutate: deleteTransportCost,
    error: deleteTransportCostError,
    isError: isDeleteTransportCostError,
    isSuccess: isDeleteTransportCostSuccess,
    isLoading: isDeleteTransportCostLoading,
  } = useDeleteTransportCost(orderId);

  const {
    mutate: updateOrder,
    error: updateOrderError,
    isError: isUpdateOrderError,
    isSuccess: isUpdateOrderSuccess,
    isLoading: isUpdateOrderLoading,
  } = useUpdateOrder(orderId);

  const [rateDate, setRateDate] = useState<string | null>(
    constructRateDate(rate)
  );

  const id = orderId.toString().padStart(4, "0");

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEurRate(e.target.value);
    setRateDate(null);
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value as CURRENCY);
  };

  const transportCostPerM3 = transportCostPerM3ToCalculation(
    transportCost,
    expanses
  );

  const expanseData = customExpanseDataToCalculation(
    expanses,
    specType,
    currency,
    eurRate,
    transportCostPerM3
  );

  const handleCalculationDelete = () => {
    onClose();
    deleteExpanses();
    deleteTransportCost();
    updateOrder({ profit: null });
  };

  const handleQuantityTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSpecType(e.target.value as QUANTITY_TYPE);
  };

  useEffect(() => {
    if (
      isDeleteExpansesSuccess &&
      isDeleteTransportCostSuccess &&
      isUpdateOrderSuccess
    ) {
      router.push(`/orders/${orderId}`);
    }
  }, [
    isDeleteExpansesSuccess,
    isDeleteTransportCostSuccess,
    isUpdateOrderSuccess,
    orderId,
  ]);

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
                    <Td>{row.quantity.toFixed(2).replace(/\.00$/, "")}</Td>
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
          <Text color="red">
            {isDeleteExpansesError &&
              t(
                `errors.backendErrorLabel.${mapAxiosErrorToLabel(
                  deleteExpansesError
                )}`
              )}
            {isDeleteTransportCostError &&
              t(
                `errors.backendErrorLabel.${mapAxiosErrorToLabel(
                  deleteTransportCostError
                )}`
              )}{" "}
            {isUpdateOrderError &&
              t(
                `errors.backendErrorLabel.${mapAxiosErrorToLabel(
                  updateOrderError
                )}`
              )}
          </Text>
          <Flex>
            <Button
              isLoading={
                isDeleteExpansesLoading ||
                isDeleteTransportCostLoading ||
                isUpdateOrderLoading
              }
              onClick={onOpen}
              colorScheme={"red"}
            >
              {t("pages.orders.order.delete-calculation")}
            </Button>
          </Flex>
        </Flex>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {t("pages.orders.order.confirm-calculation-delete")}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>{t("pages.orders.order.are-you-sure")}</ModalBody>

            <ModalFooter>
              <Button colorScheme="red" mr={3} onClick={onClose}>
                {t("buttons.cancel")}
              </Button>
              <Button colorScheme="green" onClick={handleCalculationDelete}>
                {t("buttons.confirm")}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Flex>
  );
};
