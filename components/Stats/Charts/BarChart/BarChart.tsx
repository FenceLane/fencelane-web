import ReactApexChart from "react-apexcharts";
import { Box, Text, Stack } from "@chakra-ui/react";
import { TotalRevenueOptions } from "./chart.config";
import { ArrowDownIcon } from "@chakra-ui/icons";
import { FinancesSeries } from "../../Constants";

const BarChart = () => {
  return (
    <Box
      p={6}
      flex={1}
      id="chart"
      bgColor={"#fcfcfc"}
      display={"flex"}
      flexDirection={"column"}
      borderRadius={"10px"}
    >
      <Stack my={"20px"} direction="row" gap={4} flexWrap="wrap">
        <Stack>
          <Text fontSize={"14px"}>Dochód w marcu</Text>
          <Text fontSize={38} fontWeight={600} color="#11142d">
            3310.00 €
          </Text>
        </Stack>

        <Stack direction={"row"} alignItems={"center"} gap={1}>
          <ArrowDownIcon
            border={"1px"}
            color={"red.500"}
            borderRadius={"50%"}
            borderColor={"black"}
            boxSize={5}
          />
          <Stack>
            <Text>2.23%</Text>
            <Text>Mniej niż lutym</Text>
          </Stack>
        </Stack>
      </Stack>

      <ReactApexChart
        series={FinancesSeries}
        type="bar"
        height={310}
        options={TotalRevenueOptions}
      />
    </Box>
  );
};

export default BarChart;
