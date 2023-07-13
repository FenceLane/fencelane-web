import React from "react";
import { OrderInfo } from "../../lib/types";
import {
  Box,
  Text,
  Table,
  Td,
  Th,
  Tr,
  Button,
  Thead,
  Tbody,
} from "@chakra-ui/react";
import styles from "./Calculations.module.scss";
import { useContent } from "../../lib/hooks/useContent";
import Link from "next/link";
import { ArrowForwardIcon } from "@chakra-ui/icons";

interface CalculationsProps {
  orderData: OrderInfo[];
}

export const Calculations = ({ orderData }: CalculationsProps) => {
  const { t } = useContent();
  return (
    <>
      <Text color="var(--dark)" fontSize="20px" fontWeight="500" m="10px">
        {t("pages.orders.calculations_history")}
      </Text>
      <Box
        className={styles.container}
        boxShadow="0px 4px 4px rgba(0, 0, 0, 0.15)"
        borderRadius="5px"
      >
        <Table className={styles["calc-table"]} borderRadius="5px">
          <Thead>
            <Tr borderRadius="5px">
              <Th textAlign="center">{t("pages.orders.order.order_id")}</Th>
              <Th textAlign="center">{t("pages.orders.order.profit")} [€]</Th>
              <Th textAlign="center"></Th>
            </Tr>
          </Thead>
          {orderData
            .filter((order) => order.profit !== null)
            .map((order) => (
              <Tbody key={order.id}>
                <Tr textAlign="center">
                  <Td textAlign="center">
                    {order.id.toString().padStart(4, "0")}
                  </Td>
                  <Td textAlign="center">
                    {Number(order.profit).toFixed(2).replace(/\.00$/, "")} €
                  </Td>
                  <Td>
                    <Link
                      className={styles["details-link"]}
                      href={`/calculations/${order.id}`}
                    >
                      <Button
                        color="white"
                        bg=""
                        className={styles["calc-button"]}
                      >
                        {t("pages.orders.order.calculation")}
                        <ArrowForwardIcon />
                      </Button>
                    </Link>
                  </Td>
                </Tr>
              </Tbody>
            ))}
        </Table>
      </Box>
    </>
  );
};
