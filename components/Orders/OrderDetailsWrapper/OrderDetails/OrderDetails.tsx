import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Text,
  Heading,
  Button,
  Select,
  Table,
  Tr,
  Th,
  Td,
  IconButton,
  Link,
  useDisclosure,
  Thead,
  Tbody,
} from "@chakra-ui/react";
import NextLink from "next/link";
import React, { useState } from "react";
import { useContent } from "../../../../lib/hooks/useContent";
import { OrderInfo } from "../../../../lib/types";
import { ChangeStatusModal } from "./ChangeStatusModal/ChangeStatusModal";
import styles from "./OrderDetails.module.scss";

interface OrderDetailsProps {
  orderData: OrderInfo;
}
const statusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "#339926";
    default:
      return "#232ccf";
  }
};
export const OrderDetails = ({ orderData }: OrderDetailsProps) => {
  const { t } = useContent();

  const [specType, setSpecType] = useState("pieces");

  const {
    isOpen: isStatusChangeOpen,
    onOpen: onStatusChangeOpen,
    onClose: onStatusChangeClose,
  } = useDisclosure();

  const id = orderData.id.toString().padStart(4, "0");

  const currentStatus =
    orderData.statusHistory[orderData.statusHistory.length - 1].status;

  const days = [
    t("days.monday"),
    t("days.tuesday"),
    t("days.wednesday"),
    t("days.thursday"),
    t("days.friday"),
    t("days.saturday"),
    t("days.sunday"),
  ];

  const displayDate = (rawDate: Date) => {
    const date = new Date(rawDate);
    return (
      (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
      "." +
      (Number(date.getMonth()) + 1 < 10
        ? "0" + String(Number(date.getMonth()) + 1)
        : Number(date.getMonth()) + 1) +
      "." +
      date.getFullYear() +
      " | " +
      days[date.getDay()].substring(0, 3)
    );
  };

  const handleSpecChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSpecType(e.target.value);
  };

  return (
    <Flex className={styles.container} flexDir="column">
      <Link as={NextLink} href="/orders" w="32px">
        <IconButton
          icon={<ArrowBackIcon w="32px" h="32px" />}
          aria-label="go back to orders"
          w="32px"
          bg="white"
        />
      </Link>
      <Flex className={styles["order-container"]}>
        <Flex className={styles["left"]}>
          <Box className={styles["text-box"]}>
            <Text className={styles["order-header"]}>
              {t("pages.orders.order.order_id")}
            </Text>
            <Text className={styles["order-text"]}>{id}</Text>
          </Box>
          <Box className={styles["text-box"]}>
            <Text className={styles["order-header"]}>
              {t("pages.orders.order.status")}
            </Text>
            <Text
              className={styles["order-text"]}
              fontWeight="600"
              color={statusColor(currentStatus)}
            >
              {t(`pages.orders.status.${currentStatus}`)}
            </Text>
          </Box>
          <Box className={styles["text-box"]}>
            <Text className={styles["order-header"]}>
              {t("pages.orders.order.client")}
            </Text>
            <Text className={styles["order-text"]}>
              {orderData.client.name}
            </Text>
          </Box>
        </Flex>
        <Flex className={styles["right"]}>
          <Box className={styles["text-box"]}>
            <Text className={styles["order-header"]}>
              {t("pages.orders.order.date")}
            </Text>
            <Text className={styles["order-text"]}>
              {displayDate(orderData.createdAt)}
            </Text>
          </Box>
          <Box className={styles["text-box"]}>
            <Text className={styles["order-header"]}>
              {t("pages.orders.order.destination")}
            </Text>
            <Text className={styles["order-text"]}>
              {orderData.destination.city},
            </Text>
            <Text className={styles["order-text"]}>
              {orderData.destination.country}
            </Text>
          </Box>
        </Flex>
      </Flex>
      <Flex className={styles["history-container"]} flexDir="row">
        <Flex flexDir="column" className={styles["order-history"]}>
          <Heading size="sm" mb="10px">
            {t("main.history")}
          </Heading>
          {[...orderData.statusHistory].reverse().map((status) => (
            <Flex key={status.id} flexDir="column" mb="10px" color="grey">
              <Text>{t(`pages.orders.status.${status.status}`)}</Text>
              <Text>{`${displayDate(status.date).substring(
                0,
                displayDate(status.date).length - 5
              )} | ${status.creator.name}`}</Text>
            </Flex>
          ))}
        </Flex>
        <Flex>
          <Button
            className={styles["change-status-button"]}
            color="white"
            bg="var(--button-grey)"
            fontWeight="400"
            onClick={onStatusChangeOpen}
          >
            {t("pages.orders.order.change-status")}
          </Button>
        </Flex>
      </Flex>
      <Box className={styles["spec-container"]}>
        <Flex justifyContent="space-between" alignItems="center" mt="20px">
          <Heading className={styles["spec-header"]} size="sm" mb="10px">
            {t("pages.orders.order.specification")}
          </Heading>
          <Select
            w="120px"
            mr="40px"
            color="black"
            onChange={handleSpecChange}
            value={specType}
          >
            <option value="pieces">{t("pages.orders.order.pieces")}</option>
            <option value="packages">{t("pages.orders.order.packages")}</option>
            <option value="m3">M3</option>
          </Select>
        </Flex>
        <Table className={styles["spec-table"]}>
          <Thead>
            <Tr>
              <Th>{t("pages.orders.spec-table.type")}</Th>
              <Th>{t("pages.orders.spec-table.dimensions")}</Th>
              <Th>{t("pages.orders.spec-table.quantity")}</Th>
              <Th>{t("pages.orders.spec-table.price")}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orderData &&
              orderData.products.map((product) => (
                <Tr key={product.id}>
                  <Td fontWeight={500}>
                    {product.product.category.name}
                    <br />
                    {t(
                      `pages.storage.variants.${String(
                        product.product.variant
                      )}`
                    )}
                  </Td>
                  <Td>{product.product.dimensions}</Td>
                  {specType == "pieces" && (
                    <>
                      <Td>
                        {product.quantity * product.product.itemsPerPackage}
                      </Td>
                      <Td>
                        {(
                          Number(product.price) /
                          (product.quantity * product.product.itemsPerPackage)
                        ).toFixed(2)}
                      </Td>
                    </>
                  )}
                  {specType == "packages" && (
                    <>
                      <Td>{product.quantity}</Td>
                      <Td>
                        {(Number(product.price) / product.quantity).toFixed(2)}
                      </Td>
                    </>
                  )}
                  {specType == "m3" && (
                    <>
                      <Td>
                        {product.quantity *
                          Number(product.product.volumePerPackage)}
                      </Td>
                      <Td>
                        {(
                          Number(product.price) /
                          (product.quantity *
                            Number(product.product.volumePerPackage))
                        ).toFixed(2)}
                      </Td>
                    </>
                  )}
                </Tr>
              ))}
          </Tbody>
        </Table>
      </Box>
      <Flex justifyContent="space-around" mt="10px">
        <Button color="white" bg="var(--button-orange)" fontWeight="400">
          {t("buttons.edit")}
        </Button>
        <Button color="white" bg="var(--button-blue)">
          <Link href={`/calculations/${orderData.id}`}>
            {t("pages.orders.order.calculation")}
          </Link>
        </Button>
      </Flex>
      <Flex m="40px 0px" justifyContent="space-between" alignItems="center">
        <Heading size="sm" mb="10px" ml="40px">
          {t("pages.orders.order.documents")}
        </Heading>
        <Button
          color="white"
          bg="var(--button-dark-orange)"
          fontWeight="400"
          mr="40px"
        >
          {t("buttons.add")}
        </Button>
      </Flex>
      <Table className={styles["file-table"]}>
        <Thead>
          <Tr>
            <Th>{t("pages.orders.order.file")}</Th>
            <Th>{t("pages.orders.order.download")}</Th>
          </Tr>
        </Thead>
      </Table>
      <Flex mr="20px" justifyContent="flex-end" m="20px 20px 20px 0px">
        <Button bg="var(--button-green)" color="white" fontWeight="400">
          {t("pages.orders.order.download-all")}
        </Button>
      </Flex>
      <ChangeStatusModal
        id={orderData.id}
        onClose={onStatusChangeClose}
        isOpen={isStatusChangeOpen}
        oldStatus={
          orderData.statusHistory[orderData.statusHistory.length - 1].status
        }
      />
    </Flex>
  );
};
