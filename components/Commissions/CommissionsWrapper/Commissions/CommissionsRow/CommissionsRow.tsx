import React from "react";
import { Button, Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import { CommissionInfo } from "../../../../../lib/types";
import { useContent } from "../../../../../lib/hooks/useContent";
import styles from "./CommissionsRow.module.scss";
import { constructOrderDate } from "../../../../../lib/util/dateUtils";

interface CommissionRowProps {
  commissionData: CommissionInfo;
}
// commissionData.productData.category.name
// commissionData.productData.dimensions
// commissionData.productData.variant

// commissionData.quantity
// commissionData.createDate
// commissionData.orderId

// Zrealizuj zlecenie / Usuń zlecenie (modal)

export const CommissionsRow = ({ commissionData }: CommissionRowProps) => {
  const { t } = useContent();
  return (
    <Flex className={styles["commission-container"]}>
      <Grid className={styles["commission-info"]}>
        <GridItem className={`${styles["text-box"]} ${styles["grid-1"]}`}>
          <Text className={styles["order-header"]}>
            {t("pages.storage.table.headings.name")}
          </Text>
          <Text className={styles["order-text"]}>
            {commissionData.productData.category.name}
          </Text>
        </GridItem>
        <GridItem className={`${styles["text-box"]} ${styles["grid-2"]}`}>
          <Text className={styles["order-header"]}>
            {t("pages.storage.table.headings.dimensions")}
          </Text>
          <Text className={styles["order-text"]} fontWeight="600">
            {commissionData.productData.dimensions}
          </Text>
        </GridItem>
        <GridItem className={`${styles["text-box"]} ${styles["grid-3"]}`}>
          <Text className={styles["order-header"]}>
            {t("pages.storage.table.headings.variant")}
          </Text>
          <Text className={styles["order-text"]}>
            {t(
              `pages.storage.variants.${String(
                commissionData.productData.variant
              )}`
            )}
          </Text>
        </GridItem>
        <GridItem className={`${styles["text-box"]} ${styles["grid-4"]}`}>
          <Text className={styles["order-header"]}>
            {t("pages.storage.table.headings.stock")}
          </Text>
          <Text className={styles["order-text"]}>
            {commissionData.quantity}
          </Text>
        </GridItem>
        <GridItem className={`${styles["text-box"]} ${styles["grid-5"]}`}>
          <Text className={styles["order-header"]}>{t("main.date")}</Text>
          <Text className={styles["order-text"]}>
            {constructOrderDate(String(commissionData.createDate))}
          </Text>
        </GridItem>
        <GridItem className={`${styles["text-box"]} ${styles["grid-6"]}`}>
          <Text className={styles["order-header"]}>
            {t("pages.orders.order.order_id")}
          </Text>
          <Text className={styles["order-text"]}>
            {commissionData.orderId || "brak"}
          </Text>
        </GridItem>
      </Grid>
      <Flex className={styles["commission-actions"]}>
        <Flex width="100%" justifyContent="flex-end" mb="10px">
          <Button>Zmień ilość</Button>
        </Flex>

        <Flex gap="10px">
          <Button colorScheme="green">Zrealizuj</Button>
          <Button colorScheme="blue">Zrealizuj częściowo</Button>
        </Flex>
      </Flex>
    </Flex>
  );
};
