import ReactApexChart from "react-apexcharts";
import { Text, Stack, Flex, Box } from "@chakra-ui/react";
import { TotalRevenueOptions } from "./chart.config";
import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";
import { getMonthByNumber } from "../../../../lib/util/statsFunctions";
import { OrderInfo, OrderProductInfo } from "../../../../lib/types";
import { useContent } from "../../../../lib/hooks/useContent";

interface BarChartProps {
  orders: OrderInfo[];
  month: number;
  selectedDate: Date;
}
interface DataObject {
  created: number;
  incomes: number;
  profit: number;
}

interface GroupedData {
  [month: number]: {
    incomes: number;
    costs: number;
    profit: number;
  };
}

const BarChart = ({ month, selectedDate, orders }: BarChartProps) => {
  const { t } = useContent();

  const dateMax = new Date(selectedDate);
  dateMax.setMonth(dateMax.getMonth() + 1);
  dateMax.setDate(0);

  const dateMin = new Date(dateMax);
  dateMin.setMonth(dateMin.getMonth() - 5);
  dateMin.setDate(1);

  const profitMonthBefore = Number(
    orders
      .filter((order) => {
        const orderDate = new Date(order.createdAt);
        if (selectedDate.getMonth() === 0) {
          return (
            orderDate.getMonth() === 11 &&
            orderDate.getFullYear() === selectedDate.getFullYear() - 1
          );
        } else {
          return (
            orderDate.getMonth() === selectedDate.getMonth() - 1 &&
            orderDate.getFullYear() === selectedDate.getFullYear()
          );
        }
      })
      .reduce((acc, current) => {
        if (current.profit) {
          return (acc += Number(current.profit));
        } else {
          return acc;
        }
      }, 0)
      .toFixed(2)
  );

  const profit = Number(
    orders
      .filter((order) => {
        const orderDate = new Date(order.createdAt);
        return (
          orderDate.getMonth() === selectedDate.getMonth() &&
          orderDate.getFullYear() === selectedDate.getFullYear()
        );
      })
      .reduce((acc, current) => {
        if (current.profit) {
          return (acc += Number(current.profit));
        } else {
          return acc;
        }
      }, 0)
      .toFixed(2)
  );

  let percentageRatio =
    profitMonthBefore !== 0
      ? Number(((profit / profitMonthBefore) * 100 - 100).toFixed(2))
      : profit === 0
      ? 0
      : Infinity;

  let stonks = true;

  if (percentageRatio < 0) {
    stonks = false;
    percentageRatio = Math.abs(percentageRatio);
  }

  const monthBefore = month - 1 >= 0 ? month - 1 : 11;

  const sixMonthsOrders = orders
    .filter((order) => {
      return (
        new Date(order.createdAt) > dateMin &&
        new Date(order.createdAt) < dateMax
      );
    })
    .map((order) => {
      const calcIncome = (product: OrderProductInfo) => {
        return (
          product.quantity *
          Number(product.product.volumePerPackage) *
          Number(product.price)
        );
      };
      return {
        created: new Date(order.createdAt).getMonth(),
        incomes: order.products.reduce(
          (acc, product) => acc + calcIncome(product),
          0
        ),
        profit: order.profit ? Number(order.profit) : 0,
      };
    });

  const groupDataByMonth = (data: DataObject[], selectedDate: number) => {
    const groupedData: GroupedData = {};

    for (let i = 5; i >= 0; i--) {
      let month: number = selectedDate - i;
      groupedData[month] = { incomes: 0, costs: 0, profit: 0 };
    }

    for (const obj of data) {
      const { created, incomes, profit } = obj;

      if (created >= selectedDate - 6 && created <= selectedDate) {
        if (!groupedData[created]) {
          groupedData[created] = { incomes: 0, costs: 0, profit: 0 };
        }

        groupedData[created].incomes += incomes;
        groupedData[created].costs =
          groupedData[created].incomes - groupedData[created].profit;
        groupedData[created].profit += profit;
      }
    }

    let sortedEntries = Object.entries(groupedData).sort(
      ([a], [b]) => Number(a) - Number(b)
    );

    sortedEntries = sortedEntries.map((entry) => {
      let newEntry = Number(entry[0]);
      if (newEntry < 0) {
        newEntry += 12;
      }
      return [String(newEntry), entry[1]];
    });

    const FinancesSeries = [
      {
        name: t("pages.stats.incomes"),
        data: sortedEntries.map(([_, { incomes }]) =>
          Number((incomes / 1000 + 0.01).toFixed(2))
        ),
      },
      {
        name: t("pages.stats.costs"),
        data: sortedEntries.map(([_, { costs }]) =>
          Number((costs / 1000 + 0.01).toFixed(2))
        ),
      },
      {
        name: t("pages.stats.profit"),
        data: sortedEntries.map(([_, { profit }]) =>
          Number((profit / 1000 + 0.01).toFixed(2))
        ),
      },
    ];

    return FinancesSeries;
  };

  const groupedData = groupDataByMonth(
    sixMonthsOrders,
    selectedDate.getMonth()
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
