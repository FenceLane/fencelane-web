import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Box, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { OrderInfo } from "../../../lib/types";
import styles from "./OrdersRow.module.scss";

interface OrderDataProps {
  orderData: OrderInfo["data"];
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

export const OrdersRow = ({ orderData }: OrderDataProps) => {
  console.log(orderData.date);
  return (
    <Flex className={styles["order-container"]}>
      <Flex className={styles["left"]}>
        <Box className={styles["text-box"]}>
          <Text className={styles["order-header"]}>NR ZAMÓWIENIA</Text>
          <Text className={styles["order-text"]}>
            {orderData.products[0].orderId}
          </Text>
        </Box>
        <Box className={styles["text-box"]}>
          <Text className={styles["order-header"]}>STATUS</Text>
          <Text
            className={styles["order-text"]}
            fontWeight="600"
            color={statusColor(orderData.status)}
          >
            {orderData.status}
          </Text>
        </Box>
        <Box className={styles["text-box"]}>
          <Text className={styles["order-header"]}>KLIENT</Text>
          <Text className={styles["order-text"]}>{orderData.client.name}</Text>
        </Box>
      </Flex>
      <Flex className={styles["right"]}>
        <Box className={styles["text-box"]}>
          <Text className={styles["order-header"]}>DATA</Text>
          <Text className={styles["order-text"]}>
            {String(orderData.createdAt).substring(0, 10)}
          </Text>
        </Box>
        <Box className={styles["text-box"]}>
          <Text className={styles["order-header"]}>DESTYNACJA</Text>
          <Text className={styles["order-text"]}>
            {orderData.destination.city},
          </Text>
          <Text className={styles["order-text"]}>
            {orderData.destination.country}
          </Text>
        </Box>
      </Flex>
      <Box className={styles["right-bottom"]}>
        <Text className={styles["price"]}>234</Text>
        <Link className={styles["details-link"]} href="">
          SZCZEGÓŁY
          <ArrowForwardIcon boxSize="4" />
        </Link>
      </Box>
    </Flex>
  );
};
