import React, { useState } from "react";
import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { CommissionInfo } from "../../../../../lib/types";
import { useContent } from "../../../../../lib/hooks/useContent";
import styles from "./CommissionsRow.module.scss";
import { constructOrderDate } from "../../../../../lib/util/dateUtils";
import { IconButton } from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { useIsMobile } from "../../../../../lib/hooks/useIsMobile";
import { ActionsButtons } from "./ActionsButtons/ActionsButtons";

interface CommissionRowProps {
  commissionData: CommissionInfo;
}

export const CommissionsRow = ({ commissionData }: CommissionRowProps) => {
  const { t } = useContent();

  const isMobile = useIsMobile();

  const [showProducts, setShowProducts] = useState(false);

  const toggleShowDropdown = () => {
    setShowProducts((prev) => !prev);
  };

  return (
    <Flex className={styles["commission-container"]}>
      <Flex
        className={styles["commission-top"]}
        justifyContent="space-between"
        gap="5"
      >
        <Text className={styles["commission-text"]} flexGrow="1">
          {`${t("pages.commissions.commission-id")} ${commissionData.id}`}
        </Text>
        <Text className={styles["commission-text"]} flexGrow="1">
          {constructOrderDate(String(commissionData.createDate)).slice(0, -5)}
        </Text>
        <Text className={styles["commission-text"]} flexGrow="1" width="10%">
          {commissionData.orderId
            ? isMobile
              ? t("main.order").slice(0, 5) +
                " " +
                commissionData.orderId.toString().padStart(4, "0")
              : t("main.order") +
                " " +
                commissionData.orderId.toString().padStart(4, "0")
            : " "}
        </Text>
        <IconButton
          className={styles["more-button"]}
          aria-label="more button"
          bg="white"
          onClick={toggleShowDropdown}
          icon={showProducts ? <TriangleUpIcon /> : <TriangleDownIcon />}
        />
      </Flex>

      {showProducts && (
        <Box>
          {commissionData.productData.map((product, id) => (
            <Grid key={id} className={styles["product-table"]}>
              <Flex className={styles["product-table-item"]} textAlign="left">
                {product.productInfo.category.name}
              </Flex>
              <Flex className={styles["product-table-item"]}>
                {product.productInfo.dimensions}
              </Flex>
              <Flex className={styles["product-table-item"]}>
                {product.commissionQuantity} p.
              </Flex>
              <Flex
                display="flex"
                className={styles["product-table-item"]}
                justifyContent="flex-end"
                gap="10px"
              >
                <ActionsButtons />
              </Flex>
            </Grid>
          ))}
        </Box>
      )}
    </Flex>
  );
};
