import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Box, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { useContent } from "../../../lib/hooks/useContent";
import { OrderInfo } from "../../../lib/types";
import styles from "./LoadsRow.module.scss";
import { constructLoadDate } from "../../../lib/util/dateUtils";

interface LoadsRowProps {
  loadData: OrderInfo;
}

const statusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "var(--status-delivered)";
    default:
      return "var(--status)";
  }
};

export const LoadsRow = ({ loadData }: LoadsRowProps) => {
  const { t } = useContent();

  const profit = loadData.profit;

  const id = loadData.id.toString().padStart(4, "0");

  const status =
    loadData.statusHistory[loadData.statusHistory.length - 1].status;

  return (
    <Flex className={styles["order-container"]}>
      <Flex className={styles["left"]}>
        <Box className={styles["text-box"]}>
          <Text className={styles["order-header"]}>
            {t("pages.loads.load.load_id")}
          </Text>
          <Text className={styles["order-text"]}>{id}</Text>
        </Box>
        <Box className={styles["text-box"]}>
          <Text className={styles["order-header"]}>
            {t("pages.loads.load.status")}
          </Text>
          <Text
            className={styles["order-text"]}
            fontWeight="600"
            color={statusColor(status)}
          >
            {t(`pages.loads.status.${status}`)}
          </Text>
        </Box>
        <Box className={styles["text-box"]}>
          <Text className={styles["order-header"]}>
            {t("pages.loads.load.client")}
          </Text>
          <Text className={styles["order-text"]}>
            {loadData.destination.client.name}
          </Text>
        </Box>
      </Flex>
      <Flex className={styles["right"]}>
        <Box className={styles["text-box"]}>
          <Text className={styles["order-header"]}>
            {t("pages.loads.load.date")}
          </Text>
          <Text className={styles["order-text"]}>
            {constructLoadDate(loadData.createdAt)}
          </Text>
        </Box>
        <Box className={styles["text-box"]}>
          <Text className={styles["order-header"]}>
            {t("pages.loads.load.destination")}
          </Text>
          <Text className={styles["order-text"]}>
            {loadData.destination.city},
          </Text>
          <Text className={styles["order-text"]}>
            {loadData.destination.country}
          </Text>
        </Box>
      </Flex>
      <Box className={styles["right-bottom"]}>
        {profit && (
          <Text className={styles["price"]}>
            {Number(profit).toFixed(2).replace(/\.00$/, "")}€
          </Text>
        )}
        <Link className={styles["details-link"]} href={`/loads/${loadData.id}`}>
          {t("pages.loads.load.details")}
          <ArrowForwardIcon boxSize="4" />
        </Link>
      </Box>
    </Flex>
  );
};
