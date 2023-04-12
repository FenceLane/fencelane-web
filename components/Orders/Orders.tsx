import React from "react";
import { Button, Flex, Text, useDisclosure } from "@chakra-ui/react";
import { OrderInfo } from "../../lib/types";
import { OrdersRow } from "./OrdersRow/OrdersRow";
import { AddIcon } from "@chakra-ui/icons";
import { useContent } from "../../lib/hooks/useContent";
import { OrderAddModal } from "./OrderAddModal/OrderAddModal";
import Link from "next/link";

interface OrderProps {
  orders: OrderInfo[];
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
        >
          <Link href="/orders/create">
            {t("pages.orders.buttons.new")}
            <AddIcon ml="10px" />
          </Link>
        </Button>
      </Flex>
      {orders.map((order) => (
        <OrdersRow key={order.id} orderData={order} />
      ))}
      <OrderAddModal
        onAddClose={onAddClose}
        onAddOpen={onAddOpen}
        isAddOpen={isAddOpen}
      />
    </>
  );
};
