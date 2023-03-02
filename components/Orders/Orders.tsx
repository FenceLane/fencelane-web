import React from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import { OrderInfo } from "../../lib/types";
import { OrdersRow } from "./OrdersRow/OrdersRow";
import { AddIcon } from "@chakra-ui/icons";
// import styles from "./Orders.module.scss";

interface OrderProps {
  orders: OrderInfo;
}

export const Orders = ({ orders }: OrderProps) => {
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
        >
          Nowe
          <AddIcon ml="10px" />
        </Button>
      </Flex>
      {Object.values(orders)[0].map((order: any) => (
        <OrdersRow key={order.products[0].orderId} orderData={order} />
      ))}
    </>
  );
};
