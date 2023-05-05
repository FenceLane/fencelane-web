import React from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import { OrderInfo } from "../../lib/types";
import { OrdersRow } from "./OrdersRow/OrdersRow";
import { AddIcon } from "@chakra-ui/icons";
import { useContent } from "../../lib/hooks/useContent";
import Link from "next/link";

interface OrderProps {
  orders: OrderInfo[];
}

export const Orders = ({ orders }: OrderProps) => {
  const { t } = useContent();

  return (
    <>
      <Text color="var(--dark)" fontSize="20px" fontWeight="500" m="10px">
        {t("pages.orders.order_history")}
      </Text>
      <Flex justifyContent="flex-end">
        <Link href="/orders/create">
          <Button
            color="white"
            backgroundColor="var(--add-button-color)"
            fontWeight="400"
            h="32px"
            m="0 10px 10px 0"
          >
            {t("pages.orders.buttons.new")}
            <AddIcon ml="10px" />
          </Button>
        </Link>
      </Flex>
      {orders.map((order) => (
        <OrdersRow key={order.id} orderData={order} />
      ))}
    </>
  );
};
