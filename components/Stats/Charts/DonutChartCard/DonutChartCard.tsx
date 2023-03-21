import { Box, Stat, StatLabel, StatNumber } from "@chakra-ui/react";
import ReactApexChart from "react-apexcharts";

export interface DonutChartCardProps {
  title: string;
  value: number;
  series: Array<number>;
  colors: Array<string>;
  unit: any;
}

function formatter(num: number, unit: string) {
  const formatted = num.toLocaleString("en-US");
  return unit != undefined ? `${formatted} ${unit}` : formatted;
}

const DonutChartCard = ({
  title,
  value,
  series,
  colors,
  unit,
}: DonutChartCardProps) => {
  return (
    <Box
      id={"chart"}
      flex={1}
      display={"flex"}
      bgColor={"#fcfcfc"}
      flexDirection={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
      pl={6}
      py={2}
      gap={2}
      borderRadius="10px"
      minHeight="110px"
      width="fit-content"
    >
      <Stat p={2} color={"#333333"}>
        <StatLabel fontSize={"16px"}>{title}</StatLabel>
        <StatNumber fontSize={"30px"} mt={3}>
          {formatter(value, unit)}
        </StatNumber>
      </Stat>
      <ReactApexChart
        options={{
          chart: { type: "donut" },
          colors,
          legend: { show: false },
          dataLabels: { enabled: false },
        }}
        series={series}
        type={"donut"}
        width="180px"
      />
    </Box>
  );
};

export default DonutChartCard;
