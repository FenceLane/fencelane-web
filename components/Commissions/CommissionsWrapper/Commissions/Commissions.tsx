import React, { useState } from "react";
import { Button, Flex, Select, Text } from "@chakra-ui/react";
import { useContent } from "../../../../lib/hooks/useContent";
import Link from "next/link";
import { AddIcon } from "@chakra-ui/icons";
import { CommissionsRow } from "./CommissionsRow/CommissionsRow";
import { CommissionInfo } from "../../../../lib/types";

interface CommissionsProps {
  commissions: CommissionInfo[];
}

const enum FILTER {
  ALL = "all",
  ORDERS_ONLY = "orders-only",
  NON_ORDERS_ONLY = "non-orders-only",
}

export const Commissions = ({ commissions }: CommissionsProps) => {
  const { t } = useContent();

  const [orderFilter, setOrderFilter] = useState(FILTER.ALL);

  return (
    <>
      <Text color="var(--dark)" fontSize="20px" fontWeight="500" m="10px">
        {t("main.commissions")}
      </Text>
      <Flex justifyContent="space-between" mb="20px">
        <Select
          onChange={(e) => setOrderFilter(e.target.value as FILTER)}
          defaultValue="all"
          bg="white"
          width="auto"
        >
          <option value={FILTER.ALL}>
            {t("pages.commissions.filters.all")}
          </option>
          <option value={FILTER.ORDERS_ONLY}>
            {t("pages.commissions.filters.orders-only")}
          </option>
          <option value={FILTER.NON_ORDERS_ONLY}>
            {t("pages.commissions.filters.non-orders-only")}
          </option>
        </Select>
        <Link href="/commissions/create">
          <Button
            color="white"
            backgroundColor="var(--add-button-color)"
            fontWeight="400"
            h="32px"
            m="0 10px 10px 0"
          >
            {t("pages.orders.buttons.new")}
            <AddIcon ml="10px" />
          </Button>
        </Link>
      </Flex>
      {commissions.map((commission) => {
        if (
          orderFilter === FILTER.ALL ||
          (orderFilter === FILTER.ORDERS_ONLY && commission.orderId) ||
          (orderFilter === FILTER.NON_ORDERS_ONLY && !commission.orderId)
        ) {
          return (
            <CommissionsRow key={commission.id} commissionData={commission} />
          );
        }
      })}
    </>
  );
};
