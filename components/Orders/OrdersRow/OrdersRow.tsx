import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Box, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { useContent } from "../../../lib/hooks/useContent";
import { OrderInfo } from "../../../lib/types";
import styles from "./OrdersRow.module.scss";

interface OrderDataProps {
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

export const OrdersRow = ({ orderData }: OrderDataProps) => {
  const { t } = useContent();

  const date = new Date(orderData.createdAt);

  const profit = orderData.profit;

  const id = orderData.id.toString().padStart(4, "0");

  const status =
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

  const displayDate =
    (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
    "." +
    (Number(date.getMonth()) + 1 < 10
      ? "0" + String(Number(date.getMonth()) + 1)
      : Number(date.getMonth()) + 1) +
    "." +
    date.getFullYear() +
    " | " +
    days[date.getDay()].substring(0, 3);

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
        <Box className={styles["text-box"]}>
          <Text className={styles["order-header"]}>
            {t("pages.orders.order.client")}
          </Text>
          <Text className={styles["order-text"]}>
            {orderData.destination.client.name}
          </Text>
        </Box>
      </Flex>
      <Flex className={styles["right"]}>
        <Box className={styles["text-box"]}>
          <Text className={styles["order-header"]}>
            {t("pages.orders.order.date")}
          </Text>
          <Text className={styles["order-text"]}>{displayDate}</Text>
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
        {profit && <Text className={styles["price"]}>{profit}€</Text>}
        <Link
          className={styles["details-link"]}
          href={`/orders/${orderData.id}`}
        >
          {t("pages.orders.order.details")}
          <ArrowForwardIcon boxSize="4" />
        </Link>
      </Box>
    </Flex>
  );
};
