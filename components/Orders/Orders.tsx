import React, { useState } from "react";
import { Button, Flex, IconButton, Input, Text } from "@chakra-ui/react";
import { OrderInfo } from "../../lib/types";
import { OrdersRow } from "./OrdersRow/OrdersRow";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import { useContent } from "../../lib/hooks/useContent";
import Link from "next/link";
import styles from "./Orders.module.scss";

interface OrderProps {
  orders: OrderInfo[];
}

const initialFilters = {
  date: "",
  client: "",
  destination: "",
  order_id: "",
};

export const Orders = ({ orders }: OrderProps) => {
  const { t } = useContent();

  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState(initialFilters);

  const toggleOpenFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const handleChangeFilters = (e: {
    target: { name: string; value: string };
  }) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDeleteFilterDate = () => {
    setFilters((prev) => ({ ...prev, date: "" }));
  };

  return (
    <>
      <Text color="var(--dark)" fontSize="20px" fontWeight="500" m="10px">
        {t("pages.orders.order_history")}
      </Text>
      <Flex justifyContent="space-between">
        <Button
          fontWeight="400"
          h="32px"
          m="0 10px 10px 0"
          backgroundColor="var(--dark)"
          color="white"
          onClick={toggleOpenFilters}
        >
          Filtry
        </Button>
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
      {showFilters && (
        <Flex className={styles["filters-container"]} flexDirection="column">
          <Flex flexDirection="column" mb="10px">
            <label>Data</label>
            <Flex flexDir="row" gap="10px">
              <Input
                bg="white"
                type="date"
                name="date"
                onChange={handleChangeFilters}
                value={filters.date}
              />
              {filters.date !== "" && (
                <IconButton
                  colorScheme="red"
                  aria-label="Delete date filter"
                  icon={<CloseIcon />}
                  onClick={handleDeleteFilterDate}
                />
              )}
            </Flex>
          </Flex>
          <Flex flexDirection="column" mb="10px">
            <label>Klient</label>
            <Input
              bg="white"
              type="text"
              name="client"
              onChange={handleChangeFilters}
            />
          </Flex>
          <Flex flexDirection="column" mb="10px">
            <label>Destynacja</label>
            <Input
              bg="white"
              type="text"
              name="destination"
              onChange={handleChangeFilters}
            />
          </Flex>
          <Flex flexDirection="column" mb="10px">
            <label>Nr zamówienia</label>
            <Input
              bg="white"
              type="number"
              name="order_id"
              onChange={handleChangeFilters}
            />
          </Flex>
        </Flex>
      )}
      <Flex flexDirection="column">
        {orders
          .filter((order) => {
            const date = new Date(filters.date);
            const dateBool =
              Date.parse(String(date)) ===
                Date.parse(String(order.createdAt).slice(0, 10)) ||
              filters.date === "";
            const clientBool =
              order.destination.client.name
                .toLowerCase()
                .includes(filters.client) || filters.client === "";

            const destinationBool =
              order.destination.address
                .toLowerCase()
                .includes(filters.destination) ||
              order.destination.city
                .toLowerCase()
                .includes(filters.destination) ||
              order.destination.country
                .toLowerCase()
                .includes(filters.destination) ||
              order.destination.postalCode
                .toLowerCase()
                .includes(filters.destination) ||
              filters.destination === "";

            const orderIdBool =
              order.id === Number(filters.order_id) || filters.order_id === "";
            return dateBool && clientBool && destinationBool && orderIdBool;
          })
          .map((order) => (
            <OrdersRow key={order.id} orderData={order} />
          ))}
      </Flex>
    </>
  );
};
