import { Box } from "@chakra-ui/react";
import React from "react";
import styles from "./CalculationCreator.module.scss";

interface CalculationCreatorProps {
  orderId: number;
}

export const CalculationCreator = ({ orderId }: CalculationCreatorProps) => {
  return <Box className={styles.container}>kreator kalkulacji</Box>;
};
