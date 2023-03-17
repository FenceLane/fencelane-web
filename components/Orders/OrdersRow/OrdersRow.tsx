import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Box, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { useContent } from "../../../lib/hooks/useContent";
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

export const OrdersRow = ({ orderData }: any) => {
  const { t } = useContent();

  const date = new Date(orderData.createdAt);

  const price = orderData.products.reduce(
    (sum: number, object: { price: string }) => {
      return sum + Number(object.price);
    },
    0
  );

  const id = orderData.id
    .toString()
    .padStart(5 - orderData.id.toString().length, "0");

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
          <Text className={styles["order-text"]}>{orderData.client.name}</Text>
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
        <Text className={styles["price"]}>{price}€</Text>
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
