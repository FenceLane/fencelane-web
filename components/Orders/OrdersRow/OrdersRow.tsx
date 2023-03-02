import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { OrderInfo } from "../../../lib/types";
import styles from "./OrdersRow.module.scss";

interface OrderDataProps {
  orderData: OrderInfo["data"];
}

export const OrdersRow = ({ orderData }: OrderDataProps) => {
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
          <Text className={styles["order-text"]}>NASYCANIE</Text>
        </Box>
        <Box className={styles["text-box"]}>
          <Text className={styles["order-header"]}>KLIENT</Text>
          <Text className={styles["order-text"]}></Text>
        </Box>
      </Flex>
      <Flex className={styles["right"]}>
        <Box className={styles["text-box"]}>
          <Text className={styles["order-header"]}>DATA</Text>
          <Text className={styles["order-text"]}></Text>
        </Box>
        <Box className={styles["text-box"]}>
          <Text className={styles["order-header"]}>DESTYNACJA</Text>
          <Text className={styles["order-text"]}></Text>
        </Box>
      </Flex>
    </Flex>
  );
};
