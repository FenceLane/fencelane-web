import { Flex, Table, Th, Thead, Tr } from "@chakra-ui/react";
import React from "react";
import { ParentOrdersRow } from "./ParentOrdersRow/ParentOrdersRow";
import { OrderInfo } from "../../lib/types";
import styles from "./ParentOrders.module.scss";
import { useIsMobile } from "../../lib/hooks/useIsMobile";

interface ParentOrdersProps {
  ordersData: { [ParentOrderId: string]: OrderInfo[] };
}

export const ParentOrders = ({ ordersData }: ParentOrdersProps) => {
  const isMobile = useIsMobile();

  return (
    <Flex bg="white" className={styles["wrapper"]}>
      <Table className={styles["orders-table"]}>
        <Thead borderBottom="3px solid var(--light-content)">
          <Tr>
            <Th>{isMobile ? "Nr zamówienia".slice(0, -5) : "Nr zamówienia"}</Th>
            <Th>{isMobile ? "Nr załadunku".slice(0, -5) : "Nr załadunku"}</Th>
            <Th>Produkty</Th>
            <Th>Ilość</Th>
          </Tr>
        </Thead>
        {Object.entries(ordersData).map((value) => (
          <ParentOrdersRow key={value[0]} orderData={value} />
        ))}
      </Table>
    </Flex>
  );
};
