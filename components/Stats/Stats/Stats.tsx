import React, { useState } from "react";
import ProductTypes from "../../../components/Stats/Charts/ProductsTypes/ProductTypes";
import { Box, Flex, Text } from "@chakra-ui/react";
import styles from "./Stats.module.scss";
import dynamic from "next/dynamic";
import { CategoryInfo, OrderInfo, ProductInfo } from "../../../lib/types";
import { sumStockByCategory } from "../../../lib/util/statsFunctions";
import { DonutCharts } from "../DonutCharts/DonutCharts";
import { MonthSelect } from "../MonthSelect/MonthSelect";
import { useContent } from "../../../lib/hooks/useContent";

const BarChart = dynamic(
  () => import("../../../components/Stats/Charts/BarChart/BarChart"),
  { ssr: false }
);

interface StatsProps {
  orders: OrderInfo[];
  products: ProductInfo[];
  categories: CategoryInfo[];
}

export const Stats = ({ orders, products, categories }: StatsProps) => {
  const { t } = useContent();

  const date = new Date();
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(date.getMonth());
  date.setMonth(selectedMonth);
  if (date.getMonth() > currentDate.getMonth()) {
    date.setFullYear(new Date().getFullYear() - 1);
  } else {
    date.setFullYear(new Date().getFullYear());
  }

  date.setDate(1);
  const monthOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    return orderDate.getMonth() === date.getMonth();
  });

  return (
    <Flex width={"100%"} minHeight="100%" flexDirection="column">
      <Box
        fontSize={"20px"}
        display={"inline-flex"}
        flex={"row"}
        justifyContent="flex-start"
        alignItems="center"
        gap={2}
        pl={2}
        pt={1}
      >
        <Text fontWeight={500} color={"#333333"}>
          {t("pages.stats.overview")}
        </Text>
        <MonthSelect
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
        />
      </Box>
      <DonutCharts key={selectedMonth} orders={monthOrders} />
      <Flex
        className={styles["main-content"]}
        mt={3}
        borderRadius={4}
        gap={4}
        flex="1"
      >
        <BarChart month={selectedMonth} selectedDate={date} orders={orders} />
        <Box bgColor={"#fcfcfc"} borderRadius={"10px"} p={6}>
          <Text fontWeight={500} color={"#333333"} fontSize="20px" mb="20px">
            {t("pages.stats.last_loadings")}
          </Text>
          {orders.slice(0, 10).map((order) => (
            <Flex
              key={order.id}
              justifyContent="space-between"
              p="20px 0px"
              borderBottom="2px solid gray"
            >
              <Text fontSize="16px">
                {order.id.toString().padStart(4, "0")}
              </Text>
              <Text fontSize="16px">+ {Number(order.profit).toFixed(2)} €</Text>
            </Flex>
          ))}
        </Box>
        <Box bgColor={"#fcfcfc"} borderRadius={"10px"} p={6}>
          <Text fontWeight={500} color={"#333333"} fontSize="20px" mb="30px">
            {t("main.storage")}
          </Text>
          {sumStockByCategory(products, categories).map((bar) => (
            <ProductTypes key={bar.title} {...bar} />
          ))}
        </Box>
      </Flex>
    </Flex>
  );
};
