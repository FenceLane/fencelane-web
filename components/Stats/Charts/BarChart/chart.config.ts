import { ApexOptions } from "apexcharts";

export const TotalRevenueOptions: ApexOptions = {
  chart: {
    type: "bar",
    toolbar: {
      show: false,
    },
  },
  colors: ["#475BE8", "#CFC8FF", "#BFBFBF"],
  plotOptions: {
    bar: {
      borderRadius: 4,
      horizontal: false,
      columnWidth: "80%",
    },
  },
  dataLabels: {
    enabled: false,
  },
  grid: {
    show: false,
  },
  stroke: {
    colors: ["transparent"],
    width: 4,
  },
  yaxis: {
    forceNiceScale: true,
    min: 0.1,
    labels: {
      formatter: function (value: number) {
        return Math.round(value).toString();
      },
    },
    title: {
      text: "€ ( tys. )",
    },
  },
  fill: {
    opacity: 1,
  },
  legend: {
    position: "top",
    horizontalAlign: "right",
  },
  tooltip: {
    y: {
      formatter(val: number) {
        return `${val} tys. € `;
      },
    },
  },
};
