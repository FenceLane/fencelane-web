import ReactApexChart from "react-apexcharts";
import { Text, Stack, Flex, Box } from "@chakra-ui/react";
import { TotalRevenueOptions } from "./chart.config";
import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";
import {
  dateMaxFunction,
  dateMinFunction,
  getMonthByNumber,
  groupDataByMonthFunction,
  monthBeforeFunction,
  percentageRatioFunction,
  profitFunction,
  profitMonthBeforeFunction,
  sixMonthsOrdersFunction,
  stonksFunction,
} from "../../../../lib/util/statsFunctions";
import { OrderInfo } from "../../../../lib/types";
import { useContent } from "../../../../lib/hooks/useContent";

interface BarChartProps {
  orders: OrderInfo[];
  month: number;
  selectedDate: Date;
}

const BarChart = ({ month, selectedDate, orders }: BarChartProps) => {
  const { t } = useContent();

  const dateMax = dateMaxFunction(selectedDate);

  const dateMin = dateMinFunction(dateMax);

  const profitMonthBefore = profitMonthBeforeFunction(orders, selectedDate);

  const profit = profitFunction(orders, selectedDate);

  let percentageRatio = percentageRatioFunction(profitMonthBefore, profit);

  const stonks = stonksFunction(percentageRatio);

  if (stonks === false) {
    percentageRatio = Math.abs(percentageRatio);
  }
  const monthBefore = monthBeforeFunction(month);

  const sixMonthsOrders = sixMonthsOrdersFunction(orders, dateMin, dateMax);

  const groupedData = groupDataByMonthFunction(
    sixMonthsOrders,
    selectedDate.getMonth(),
    t("pages.stats.incomes"),
    t("pages.stats.costs"),
    t("pages.stats.profit")
  );

  return (
    <Flex
      minHeight="400px"
      p={8}
      id="chart"
      flex="1"
      bgColor={"#fcfcfc"}
      flexDirection={"column"}
      borderRadius={"10px"}
    >
      <Stack direction="row" gap={4} flexWrap="wrap">
        <Stack>
          <Text fontSize={"16px"} fontWeight="500">
            {t("pages.stats.overview")}{" "}
            {t(`months.${getMonthByNumber(month)}`).toLowerCase()}
          </Text>
          <Text fontSize={38} fontWeight={600} color="#11142d">
            {profit} €
          </Text>
        </Stack>

        <Stack direction={"row"} alignItems={"center"} gap={1}>
          {stonks && (
            <>
              <ArrowUpIcon
                border={"1px"}
                color={"green.500"}
                borderRadius={"50%"}
                boxSize={5}
              />
              <Stack>
                <Text>{percentageRatio} %</Text>
                <Text>
                  {t("pages.stats.more_than_in")}{" "}
                  {t(`months.${getMonthByNumber(monthBefore)}`).toLowerCase()}
                </Text>
              </Stack>
            </>
          )}
          {!stonks && (
            <>
              <ArrowDownIcon
                border={"1px"}
                color={"red.500"}
                borderRadius={"50%"}
                boxSize={5}
              />
              <Stack>
                <Text>{percentageRatio} %</Text>
                <Text>
                  {t("pages.stats.less_than_in")}{" "}
                  {t(`months.${getMonthByNumber(monthBefore)}`).toLowerCase()}
                </Text>
              </Stack>
            </>
          )}
        </Stack>
      </Stack>
      <Box flex="1">
        <ReactApexChart
          series={groupedData}
          type="bar"
          height="100%"
          options={{
            ...TotalRevenueOptions,
            xaxis: {
              categories: [
                t(`months.${getMonthByNumber(month - 5)}`),
                t(`months.${getMonthByNumber(month - 4)}`),
                t(`months.${getMonthByNumber(month - 3)}`),
                t(`months.${getMonthByNumber(month - 2)}`),
                t(`months.${getMonthByNumber(month - 1)}`),
                t(`months.${getMonthByNumber(month)}`),
              ],
            },
          }}
        />
      </Box>
    </Flex>
  );
};

export default BarChart;
