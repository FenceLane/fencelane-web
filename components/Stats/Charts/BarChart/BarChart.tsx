import ReactApexChart from "react-apexcharts";
import { Text, Stack, Flex, Box } from "@chakra-ui/react";
import { TotalRevenueOptions } from "./chart.config";
import { ArrowDownIcon } from "@chakra-ui/icons";
import { FinancesSeries } from "../../Constants";

const BarChart = () => {
  return (
    <Flex
      minHeight="400px"
      p={6}
      id="chart"
      flex="1"
      bgColor={"#fcfcfc"}
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
      <Box flex="1">
        <ReactApexChart
          series={FinancesSeries}
          type="bar"
          height="100%"
          options={TotalRevenueOptions}
        />
      </Box>
    </Flex>
  );
};

export default BarChart;
