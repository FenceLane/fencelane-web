import React from "react";
import { TransportInfo, ExpansesInfo } from "../../../lib/types";

interface CalculationProps {
  orderId: number;
  transportCost: TransportInfo;
  expanses: ExpansesInfo;
}

export const Calculation = ({
  orderId,
  transportCost,
  expanses,
}: CalculationProps) => {
  return <div>Wyświetlanie zapisanej kalkulacji</div>;
};
