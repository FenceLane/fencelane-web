import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Box, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { useContent } from "../../../lib/hooks/useContent";
import { OrderInfo } from "../../../lib/types";
import styles from "./OrdersRow.module.scss";
import { constructOrderDate } from "../../../lib/util/dateUtils";

interface OrderDataProps {
  orderData: OrderInfo;
}

const statusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "var(--status-delivered)";
    default:
      return "var(--status)";
  }
};

export const OrdersRow = ({ orderData }: OrderDataProps) => {
  const { t } = useContent();

  const profit = orderData.profit;

  const id = orderData.id.toString().padStart(4, "0");

  const status =
    orderData.statusHistory[orderData.statusHistory.length - 1].status;

  return (
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
            {t("pages.orders.order.parent_order_id")}
          </Text>
          <Text className={styles["order-text"]}>
            {orderData.parentOrderId}
          </Text>
        </Box>
        <Box className={styles["text-box"]}>
          <Text className={styles["order-header"]}>
            {t("pages.orders.order.status")}
          </Text>
          <Text
            className={styles["order-text"]}
            fontWeight="600"
            color={statusColor(status)}
          >
            {t(`pages.orders.status.${status}`)}
          </Text>
        </Box>
      </Flex>
      <Flex className={styles["right"]}>
        <Box className={styles["text-box"]}>
          <Text className={styles["order-header"]}>
            {t("pages.orders.order.date")}
          </Text>
          <Text className={styles["order-text"]}>
            {constructOrderDate(orderData.createdAt)}
          </Text>
        </Box>
        <Box className={styles["text-box"]}>
          <Text className={styles["order-header"]}>
            {t("pages.orders.order.client")}
          </Text>
          <Text className={styles["order-text"]}>
            {orderData.destination.client.name}
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
      <Box className={styles["right-bottom"]}>
        {profit && (
          <Text className={styles["price"]}>
            {Number(profit).toFixed(2).replace(/\.00$/, "")}€
          </Text>
        )}
        <Link
          className={styles["details-link"]}
          href={`/loads/${orderData.id}`}
        >
          {t("pages.orders.order.details")}
          <ArrowForwardIcon boxSize="4" />
        </Link>
      </Box>
    </Flex>
  );
};
