import React, { useRef, useState } from "react";
import { Button, Flex, IconButton, Input, Text } from "@chakra-ui/react";
import { OrderInfo } from "../../lib/types";
import { OrdersRow } from "./OrdersRow/OrdersRow";
import { AddIcon, CalendarIcon, CloseIcon } from "@chakra-ui/icons";
import { useContent } from "../../lib/hooks/useContent";
import Link from "next/link";
import styles from "./Orders.module.scss";
import { useOnClickOutside } from "../../lib/hooks/useOnClickOutside";
import { constructOrderDate } from "../../lib/util/dateUtils";
import { orderFilters } from "../../lib/util/ordersUtils";

interface OrderProps {
  orders: OrderInfo[];
}

const initialFilters = {
  dateStart: "",
  dateEnd: "",
  specificDate: "",
  search: "",
};

const enum DATES {
  TODAY = "today",
  YESTERDAY = "yesterday",
  THIS_MONTH = "this-month",
  LAST_MONTH = "last-month",
  LAST_THREE_MONTHS = "last-three-months",
}

export const Orders = ({ orders }: OrderProps) => {
  const { t } = useContent();

  const [showFilters, setShowFilters] = useState(false);

  const [showDateFilters, setShowDateFilters] = useState(false);

  const [filters, setFilters] = useState(initialFilters);

  const ref = useRef<HTMLDivElement | null>(null);

  useOnClickOutside(ref, () => setShowDateFilters(false));

  const toggleOpenFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const toggleOpenDateFilters = () => {
    setShowDateFilters((prev) => !prev);
  };

  const handleChangeFilters = (e: {
    target: { name: string; value: string };
  }) => {
    if (e.target.name === "dateStart" || e.target.name === "dateEnd") {
      setFilters((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
        specificDate: "",
      }));
    } else {
      setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleChangeSpecificDate = (newSpecificDate: DATES) => {
    setFilters((prev) => ({
      ...prev,
      specificDate: newSpecificDate,
      dateStart: "",
      dateEnd: "",
    }));
  };

  const handleDeleteSearch = () => {
    setFilters((prev) => ({ ...prev, search: "" }));
  };

  const handleDeleteDate = () => {
    setFilters((prev) => ({
      ...prev,
      dateStart: "",
      dateEnd: "",
      specificDate: "",
    }));
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
        <Link href="/loads/create">
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
        <Flex
          className={styles["filters-container"]}
          flexDirection="column"
          flexWrap="wrap"
        >
          <Flex flexDirection="column" mb="10px" position="relative">
            <Flex gap="10px" flexWrap="wrap">
              <Button
                bg="white"
                onClick={toggleOpenDateFilters}
                className={styles["filter-input"]}
              >
                {t("pages.orders.check-date")} &nbsp; <CalendarIcon />
              </Button>
              {((filters.dateStart && filters.dateEnd) ||
                filters.specificDate) && (
                <>
                  <Flex gap="10px">
                    <Button
                      _hover={{ background: "green" }}
                      cursor="default"
                      bg="green"
                      color="white"
                    >
                      {filters.dateStart && filters.dateEnd && (
                        <Text>{`${constructOrderDate(filters.dateStart).slice(
                          0,
                          -5
                        )} - ${constructOrderDate(filters.dateEnd).slice(
                          0,
                          -5
                        )}`}</Text>
                      )}
                      {filters.specificDate && (
                        <Text>{t(`dates.${filters.specificDate}`)}</Text>
                      )}
                    </Button>
                    <IconButton
                      colorScheme="red"
                      aria-label="Delete date filter"
                      icon={<CloseIcon />}
                      onClick={handleDeleteDate}
                    />
                  </Flex>
                </>
              )}
            </Flex>
            {showDateFilters && (
              <Flex
                className={styles["date-filters"]}
                gap="10px"
                flexDir="column"
                ref={ref}
                bg="gray.200"
              >
                <Flex flexDir="row" alignItems="end" gap="10px">
                  <Flex flexDir="column">
                    <label>{t("pages.orders.from")}</label>
                    <Input
                      bg="gray.50"
                      type="date"
                      name="dateStart"
                      onChange={handleChangeFilters}
                      value={filters.dateStart}
                    />
                  </Flex>
                  <Flex flexDir="column">
                    <label>{t("pages.orders.to")}</label>
                    <Input
                      bg="gray.50"
                      type="date"
                      name="dateEnd"
                      onChange={handleChangeFilters}
                      value={filters.dateEnd}
                    />
                  </Flex>
                </Flex>
                <Flex flexDir="column" gap="5px">
                  <Button
                    bg="gray.50"
                    variant="outline"
                    onClick={() => handleChangeSpecificDate(DATES.TODAY)}
                  >
                    {t(`dates.today`)}
                  </Button>
                  <Button
                    bg="gray.50"
                    variant="outline"
                    onClick={() => handleChangeSpecificDate(DATES.YESTERDAY)}
                  >
                    {t(`dates.yesterday`)}
                  </Button>
                  <Button
                    bg="gray.50"
                    variant="outline"
                    onClick={() => handleChangeSpecificDate(DATES.THIS_MONTH)}
                  >
                    {t(`dates.this-month`)}
                  </Button>
                  <Button
                    bg="gray.50"
                    variant="outline"
                    onClick={() => handleChangeSpecificDate(DATES.LAST_MONTH)}
                  >
                    {t(`dates.last-month`)}
                  </Button>
                  <Button
                    bg="gray.50"
                    variant="outline"
                    onClick={() =>
                      handleChangeSpecificDate(DATES.LAST_THREE_MONTHS)
                    }
                  >
                    {t(`dates.last-three-months`)}
                  </Button>
                </Flex>
              </Flex>
            )}
          </Flex>
          <Flex flexDirection="column" mb="10px">
            <Flex flexDirection="row" gap="10px">
              <Input
                placeholder={t("pages.orders.search")}
                className={styles["filter-input"]}
                bg="white"
                type="text"
                name="search"
                onChange={handleChangeFilters}
                value={filters.search}
              />
              {filters.search !== "" && (
                <IconButton
                  colorScheme="red"
                  aria-label="Delete date filter"
                  icon={<CloseIcon />}
                  onClick={handleDeleteSearch}
                />
              )}
            </Flex>
          </Flex>
        </Flex>
      )}
      <Flex flexDirection="column">
        {orders
          .filter((order) => orderFilters(filters, order))
          .map((order) => (
            <OrdersRow key={order.id} orderData={order} />
          ))}
      </Flex>
    </>
  );
};
