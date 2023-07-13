import { Flex, Table, Th, Thead, Tr } from "@chakra-ui/react";
import React from "react";
import { ParentOrdersRow } from "./ParentOrdersRow/ParentOrdersRow";
import { OrderInfo } from "../../lib/types";
import styles from "./ParentOrders.module.scss";
import { useIsMobile } from "../../lib/hooks/useIsMobile";
import { useContent } from "../../lib/hooks/useContent";

interface ParentOrdersProps {
  ordersData: { [ParentOrderId: string]: OrderInfo[] };
}

export const ParentOrders = ({ ordersData }: ParentOrdersProps) => {
  const isMobile = useIsMobile();
  const { t } = useContent();

  return (
    <Flex
      bg="white"
      className={styles["wrapper"]}
      boxShadow="0px 4px 4px rgba(0, 0, 0, 0.15)"
      borderRadius="5px"
    >
      <Table className={styles["orders-table"]}>
        <Thead borderBottom="5px solid var(--light-content)">
          <Tr>
            <Th>
              {isMobile
                ? t("pages.orders.order.parent_order_id").slice(0, -5)
                : t("pages.orders.order.parent_order_id")}
            </Th>
            <Th>
              {isMobile
                ? t("pages.orders.order.order_id").slice(0, -4)
                : t("pages.orders.order.order_id")}
            </Th>
            <Th>{t("pages.orders.order.products")}</Th>
            <Th>{t("main.quantity")}</Th>
          </Tr>
        </Thead>
        {Object.entries(ordersData).map((value) => {
          if (value[0] !== "other") {
            return <ParentOrdersRow key={value[0]} orderData={value} />;
          }
        })}
      </Table>
    </Flex>
  );
};
