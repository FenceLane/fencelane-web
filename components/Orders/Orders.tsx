import React from "react";
import { Button, Flex, Text, useDisclosure } from "@chakra-ui/react";
import { OrderInfo } from "../../lib/types";
import { OrdersRow } from "./OrdersRow/OrdersRow";
import { AddIcon } from "@chakra-ui/icons";
import { useContent } from "../../lib/hooks/useContent";
import { OrderAddModal } from "./OrderAddModal/OrderAddModal";
// import styles from "./Orders.module.scss";

interface OrderProps {
  orders: OrderInfo;
}

export const Orders = ({ orders }: OrderProps) => {
  const { t } = useContent();

  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();

  return (
    <>
      <Text color="var(--dark)" fontSize="20px" fontWeight="500" m="10px">
        Historia zamówień
      </Text>
      <Flex justifyContent="flex-end">
        <Button
          color="white"
          backgroundColor="var(--add-button-color)"
          fontWeight="400"
          h="32px"
          m="0 10px 10px 0"
          onClick={onAddOpen}
        >
          {t("pages.orders.buttons.new")}
          <AddIcon ml="10px" />
        </Button>
      </Flex>
      {Object.values(orders)[0].map((order: any) => (
        <OrdersRow key={order.products[0].orderId} orderData={order} />
      ))}
      <OrderAddModal onAddClose={onAddClose} isAddOpen={isAddOpen} />
    </>
  );
};
