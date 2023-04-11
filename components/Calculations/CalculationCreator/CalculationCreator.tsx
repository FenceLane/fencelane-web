import { Box } from "@chakra-ui/react";
import React from "react";
import styles from "./CalculationCreator.module.scss";

interface CalculationCreatorProps {
  orderId: number;
  calculationId: number;
}

export const CalculationCreator = ({
  orderId,
  calculationId,
}: CalculationCreatorProps) => {
  return <Box className={styles.container}></Box>;
};
