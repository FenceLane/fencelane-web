import React, { useState } from "react";
import { Box, Flex, Text, Button } from "@chakra-ui/react";
import { CommissionInfo } from "../../../../../lib/types";
import { useContent } from "../../../../../lib/hooks/useContent";
import styles from "./CommissionsRow.module.scss";
import { constructOrderDate } from "../../../../../lib/util/dateUtils";
import { IconButton } from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { useIsMobile } from "../../../../../lib/hooks/useIsMobile";
import { ActionsButtons } from "./ActionsButtons/ActionsButtons";
import { useUpdateCommissionProducts } from "../../../../../lib/api/hooks/commissions";
import { mapAxiosErrorToLabel } from "../../../../../lib/server/BackendError/BackendError";

interface CommissionRowProps {
  commissionData: CommissionInfo;
}

export const CommissionsRow = ({ commissionData }: CommissionRowProps) => {
  const { t } = useContent();

  const isMobile = useIsMobile();

  const {
    mutate: updateCommission,
    error: updateCommissionError,
    isError: isUpdateCommissionError,
    isSuccess: isUpdateCommissionSuccess,
    isLoading: isUpdateCommissionLoading,
  } = useUpdateCommissionProducts(commissionData.id);

  const [showProducts, setShowProducts] = useState(false);

  const toggleShowDropdown = () => {
    setShowProducts((prev) => !prev);
  };

  const handleCompleteCommission = () => {
    const productData = commissionData.products.map((product) => ({
      filledQuantity: product.quantity,
      productCommissionId: product.id,
    }));
    updateCommission(productData);
  };

  return (
    <Flex className={styles["commission-container"]}>
      <Flex
        className={styles["commission-top"]}
        justifyContent="space-between"
        gap="5px"
      >
        <Flex className={styles["commission-top-item"]}>
          <Text className={styles["commission-text"]} flexGrow="1">
            {`${t("pages.commissions.commission-id")} ${commissionData.id}`}
          </Text>
          <Text className={styles["commission-text"]} flexGrow="1">
            {constructOrderDate(String(commissionData.date)).slice(0, -5)}
          </Text>
          {isMobile && (
            <Flex justifyContent="flex-end" flex="1">
              <Button
                colorScheme="green"
                onClick={handleCompleteCommission}
                isLoading={isUpdateCommissionLoading}
              >
                {t("buttons.complete")}
              </Button>
            </Flex>
          )}
        </Flex>
        <Flex className={styles["commission-top-item"]}>
          {commissionData.orderId ? (
            isMobile ? (
              <>
                <Text
                  className={styles["commission-text"]}
                  flexGrow="1"
                  width="10%"
                >
                  {t("main.order").slice(0, 5) +
                    " " +
                    commissionData.orderId.toString().padStart(4, "0")}
                </Text>
                <Text
                  className={styles["commission-text"]}
                  flexGrow="1"
                  width="10%"
                >
                  {t("main.load").slice(0, 5) +
                    " " +
                    commissionData.order.parentOrderId}
                </Text>
              </>
            ) : (
              <>
                <Text
                  className={styles["commission-text"]}
                  flexGrow="1"
                  width="10%"
                >
                  {t("main.order") +
                    " " +
                    commissionData.orderId.toString().padStart(4, "0")}
                </Text>
                <Text
                  className={styles["commission-text"]}
                  flexGrow="1"
                  width="10%"
                >
                  {t("main.load") + " " + commissionData.order.parentOrderId}
                </Text>
              </>
            )
          ) : (
            <></>
          )}
          <Flex flex="1" justifyContent="flex-end" gap="30px">
            {!isMobile && (
              <Flex justifyContent="flex-end" flex="1">
                <Button
                  colorScheme="green"
                  onClick={handleCompleteCommission}
                  isLoading={isUpdateCommissionLoading}
                >
                  {t("buttons.complete")}
                </Button>
              </Flex>
            )}
            <IconButton
              className={styles["more-button"]}
              aria-label="more button"
              bg="white"
              onClick={toggleShowDropdown}
              icon={showProducts ? <TriangleUpIcon /> : <TriangleDownIcon />}
            />
          </Flex>
        </Flex>
      </Flex>

      {showProducts && (
        <Box>
          {commissionData.products
            .sort((a, b) => {
              const idA = a.id.toUpperCase();
              const idB = b.id.toUpperCase();
              if (idA < idB) {
                return -1;
              }
              if (idA > idB) {
                return 1;
              }

              return 0;
            })
            .map((product, id) => (
              <Flex key={id} className={styles["product-table"]}>
                <Flex className={styles["product-table-item"]} textAlign="left">
                  {product.product.category.name}
                </Flex>
                <Flex className={styles["product-table-item"]}>
                  {product.product.dimensions}
                </Flex>
                <Flex className={styles["product-table-item"]}>
                  {product.quantity} p.
                </Flex>
                <Flex
                  display="flex"
                  className={styles["product-table-item"]}
                  justifyContent="flex-end"
                  gap="10px"
                >
                  <ActionsButtons
                    product={product}
                    commissionId={commissionData.id}
                  />
                </Flex>
              </Flex>
            ))}
        </Box>
      )}
      {isUpdateCommissionError &&
        t(
          `errors.backendErrorLabel.${mapAxiosErrorToLabel(
            updateCommissionError
          )}`
        )}
    </Flex>
  );
};
