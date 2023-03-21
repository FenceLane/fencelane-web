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
} from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { useContent } from "../../../../lib/hooks/useContent";
import { OrderInfo } from "../../../../lib/types";
import styles from "./OrderDetails.module.scss";

interface OrderDetailsProps {
  orderData: OrderInfo;
}
const statusColor = (status: string) => {
  switch (status) {
    case "created":
      return "#811081";
    case "preparing":
      return "#805AD5";
    case "packed":
      return "red";
    case "delivery":
      return "#C7BB52";
    case "finished":
      return "#38A169";
    default:
      return "#ededed";
  }
};
export const OrderDetails = ({ orderData }: OrderDetailsProps) => {
  const { t } = useContent();
  const id = orderData.id
    .toString()
    .padStart(5 - orderData.id.toString().length, "0");
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
      <Box>
        <Flex p="20px 40px" flexDir="row">
          <Flex flexDir="column" className={styles["order-history"]}>
            <Heading size="sm" mb="10px">
              HISTORIA
            </Heading>
            {[...orderData.statusHistory].reverse().map((status) => (
              <Flex key={status.id} flexDir="column" mb="10px" color="grey">
                <Text>{t(`pages.orders.status.${status.status}`)}</Text>
                <Text>{`${displayDate(
                  status.date
                )} | ${status.creatorId.substring(0, 5)}`}</Text>
              </Flex>
            ))}
          </Flex>
          <Flex>
            <Button color="white" bg="var(--button-grey)" fontWeight="400">
              Zmień status
            </Button>
          </Flex>
        </Flex>
      </Box>
      <Flex justifyContent="space-between" alignItems="center" mt="20px">
        <Heading size="sm" mb="10px" ml="40px">
          SPECYFIKACJA
        </Heading>
        <Select w="120px" mr="40px" bg="var(--font-gray)" color="white">
          <option>SZTUKI</option>
          <option>PAKIETY</option>
        </Select>
      </Flex>
      <Table className={styles["spec-table"]}>
        <Tr>
          <Th>RODZAJ</Th>
          <Th>WYMIAR</Th>
          <Th>ILOŚĆ</Th>
          <Th>CENA</Th>
        </Tr>
        {orderData.products.map((product) => (
          <Tr key={product.id}>
            <Td>{product.productId}</Td>
            <Td>{product.productId}</Td>
            <Td>{product.quantity}</Td>
            <Td>{product.price}</Td>
          </Tr>
        ))}
      </Table>
      <Flex justifyContent="space-around" mt="10px">
        <Button color="white" bg="var(--button-orange)" fontWeight="400">
          EDYTUJ
        </Button>
        <Button color="white" bg="var(--button-blue)">
          KALKULACJA
        </Button>
      </Flex>
      <Flex m="40px 0px" justifyContent="space-between" alignItems="center">
        <Heading size="sm" mb="10px" ml="40px">
          DOKUMENTY
        </Heading>
        <Button
          color="white"
          bg="var(--button-dark-orange)"
          fontWeight="400"
          mr="40px"
        >
          DODAJ
        </Button>
      </Flex>
      <Table className={styles["file-table"]}>
        <Tr>
          <Th>PLIK</Th>
          <Th>POBIERZ</Th>
        </Tr>
      </Table>
      <Flex mr="20px" justifyContent="flex-end" m="20px 20px 20px 0px">
        <Button bg="var(--button-green)" color="white" fontWeight="400">
          POBIERZ WSZYSTKIE
        </Button>
      </Flex>
    </Flex>
  );
};
