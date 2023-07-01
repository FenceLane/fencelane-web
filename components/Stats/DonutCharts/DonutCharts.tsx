import React from "react";
import { Box } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { OrderInfo } from "../../../lib/types";
import {
  calculateAverageProfit,
  calculateTotalVolumeForOrders,
  countUniqueClients,
} from "../../../lib/util/statsFunctions";
import { useContent } from "../../../lib/hooks/useContent";

const DonutChartCard = dynamic(
  () =>
    import("../../../components/Stats/Charts/DonutChartCard/DonutChartCard"),
  { ssr: false }
);

interface DonutChartsProps {
  orders: OrderInfo[];
}
const maxValues = {
  numberOfOrders: 5,
  avgProfit: 10000,
  clients: 8,
  volume: 500,
};

export const DonutCharts = ({ orders }: DonutChartsProps) => {
  const { t } = useContent();
  const numberOfOrders = orders.length;
  const avgProfit = Number(calculateAverageProfit(orders).toFixed(2));
  const clients = countUniqueClients(orders);
  const volume = Number(calculateTotalVolumeForOrders(orders).toFixed(2));

  return (
    <Box mt={4} display="flex" flexWrap="wrap" gap={4}>
      <DonutChartCard
        title={t("pages.stats.number_of_completed_orders")}
        value={numberOfOrders} // count the number of completed orders in the current month
        labels={[
          t("pages.stats.number_of_completed_orders"),
          t("pages.stats.expected_number_of_completed_orders"),
        ]}
        series={[numberOfOrders, maxValues.numberOfOrders - numberOfOrders]}
        colors={["#f75943", "#CDCDCD"]}
        unit={undefined}
      />
      <DonutChartCard
        title={t("pages.stats.average_profit_per_order")}
        value={avgProfit} // calculate the average profit in the current month
        labels={[
          t("pages.stats.average_profit_per_order"),
          t("pages.stats.expected_average_profit_per_order"),
        ]}
        series={[avgProfit, maxValues.avgProfit - avgProfit]}
        colors={["#27c088", "#CDCDCD"]}
        unit={"€"}
      />
      <DonutChartCard
        title={t("pages.stats.number_of_clients")}
        value={clients} // count the number of customers who received the order in the current month
        labels={[
          t("pages.stats.number_of_clients"),
          t("pages.stats.expected_number_of_clients"),
        ]}
        series={[clients, maxValues.clients - clients]}
        colors={["#c37baf", "#CDCDCD"]}
        unit={undefined}
      />
      <DonutChartCard
        title={t("pages.stats.volume_of_sold_commodities")}
        value={volume} // add sold palisades in the current month
        labels={[
          t("pages.stats.volume_of_sold_commodities"),
          t("pages.stats.expected_volume_of_sold_commodities"),
        ]}
        series={[volume, maxValues.volume - volume]}
        colors={["#afe0f4", "#CDCDCD"]}
        unit={"m³"}
      />
    </Box>
  );
};
