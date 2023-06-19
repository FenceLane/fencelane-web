import React from "react";
import ProductTypes from "../../../components/Stats/Charts/ProductsTypes/ProductTypes";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import styles from "./Stats.module.scss";
import dynamic from "next/dynamic";
import { CategoryInfo, OrderInfo, ProductInfo } from "../../../lib/types";
import getCategoriesPercentages from "../../../lib/util/getCategoriesPercentages";

const DonutChartCard = dynamic(
  () =>
    import("../../../components/Stats/Charts/DonutChartCard/DonutChartCard"),
  { ssr: false }
);
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
  return (
    <Flex width={"100%"} minHeight="100%" flexDirection="column">
      <Box
        fontSize={"20px"}
        display={"inline-flex"}
        flex={"row"}
        alignItems="center"
        gap={2}
        pl={2}
        pt={1}
      >
        <Text fontWeight={500} color={"#333333"}>
          Przegląd
        </Text>
        <Text cursor={"pointer"} fontWeight={"600"}>
          marca
          <ChevronDownIcon />
        </Text>{" "}
        {/* add actuall month with select input*/}
      </Box>
      <Box mt={4} display="flex" flexWrap="wrap" gap={4}>
        <DonutChartCard
          title={"Ilość zrealizowanych zamówień"}
          value={13} // count the number of completed orders in the current month
          series={[25, 75]}
          colors={["#f75943", "#EBEBEB"]}
          unit={undefined}
        />
        <DonutChartCard
          title={"Średni zysk z zamówienia"}
          value={1123.76} // calculate the average profit in the current month
          series={[75, 25]}
          colors={["#27c088", "#EBEBEB"]}
          unit={"€"}
        />
        <DonutChartCard
          title={"Ilość klientów"}
          value={5} // count the number of customers who received the order in the current month
          series={[33, 66]}
          colors={["#c37baf", "#EBEBEB"]}
          unit={undefined}
        />
        <DonutChartCard
          title={"Objętość sprzedanego towaru"}
          value={32124} // add sold palisades in the current month
          series={[66, 33]}
          colors={["#afe0f4", "#EBEBEB"]}
          unit={"m³"}
        />
      </Box>
      <Flex
        className={styles["main-content"]}
        mt={3}
        borderRadius={4}
        gap={4}
        flex="1"
      >
        <BarChart />
        <Box bgColor={"#fcfcfc"} borderRadius={"10px"} p={6}>
          <Heading size="lg">Ostatnie załadunki</Heading>
          {orders
            .filter((order) => order.profit)
            .slice(0, 10)
            .map((order) => (
              <Flex
                key={order.id}
                justifyContent="space-between"
                p="20px 0px"
                borderBottom="2px solid gray"
              >
                <Text fontSize="16px">
                  {order.id.toString().padStart(4, "0")}
                </Text>
                <Text fontSize="16px">
                  + {Number(order.profit).toFixed(2)} €
                </Text>
              </Flex>
            ))}
        </Box>
        <Box bgColor={"#fcfcfc"} borderRadius={"10px"} p={6}>
          <Heading size="lg">Magazyn</Heading>
          {getCategoriesPercentages(products, categories).map((bar) => (
            <ProductTypes key={bar.title} {...bar} />
          ))}
        </Box>
      </Flex>
    </Flex>
  );
};
