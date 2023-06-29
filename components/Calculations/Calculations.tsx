import React from "react";
import { OrderInfo } from "../../lib/types";
import { Box, Text, Table, Td, Th, Tr, Button } from "@chakra-ui/react";
import styles from "./Calculations.module.scss";
import { useContent } from "../../lib/hooks/useContent";
import Link from "next/link";
import { ArrowForwardIcon } from "@chakra-ui/icons";

interface CalculationsProps {
  loadData: OrderInfo[];
}

export const Calculations = ({ loadData }: CalculationsProps) => {
  const { t } = useContent();
  return (
    <>
      <Text color="var(--dark)" fontSize="20px" fontWeight="500" m="10px">
        {t("pages.loads.calculations_history")}
      </Text>
      <Box className={styles.container}>
        <Table className={styles["calc-table"]}>
          <Tr>
            <Th textAlign="center">{t("pages.loads.load.load_id")}</Th>
            <Th textAlign="center">{t("pages.loads.load.profit")} [€]</Th>
            <Th textAlign="center"></Th>
          </Tr>
          {loadData
            .filter((load) => load.profit !== null)
            .map((load) => (
              <Tr key={load.id} textAlign="center">
                <Td textAlign="center">
                  {load.id.toString().padStart(4, "0")}
                </Td>
                <Td textAlign="center">
                  {Number(load.profit).toFixed(2).replace(/\.00$/, "")} €
                </Td>
                <Td>
                  <Link
                    className={styles["details-link"]}
                    href={`/calculations/${load.id}`}
                  >
                    <Button
                      color="white"
                      bg=""
                      className={styles["calc-button"]}
                    >
                      {t("pages.loads.load.calculation")}
                      <ArrowForwardIcon />
                    </Button>
                  </Link>
                </Td>
              </Tr>
            ))}
        </Table>
      </Box>
    </>
  );
};
