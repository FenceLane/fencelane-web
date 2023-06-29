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

export const Commissions = ({ commissions }: CommissionsProps) => {
  const { t } = useContent();

  const [orderFilter, setOrderFilter] = useState("all");

  return (
    <>
      <Text color="var(--dark)" fontSize="20px" fontWeight="500" m="10px">
        Zlecenia
      </Text>
      <Flex justifyContent="space-between" mb="20px">
        <Select
          onChange={(e) => setOrderFilter(e.target.value)}
          defaultValue="all"
          bg="white"
          width="auto"
        >
          <option value="all">Wszystkie</option>
          <option value="orders-only">Do załadunków</option>
          <option value="non-orders-only">Bez załadunków</option>
        </Select>
        <Link href="/commissions/create">
          <Button
            color="white"
            backgroundColor="var(--add-button-color)"
            fontWeight="400"
            h="32px"
            m="0 10px 10px 0"
          >
            {t("pages.loads.buttons.new")}
            <AddIcon ml="10px" />
          </Button>
        </Link>
      </Flex>
      {commissions.map((commission) => {
        if (
          orderFilter === "all" ||
          (orderFilter === "orders-only" && commission.orderId) ||
          (orderFilter === "non-orders-only" && !commission.orderId)
        ) {
          return (
            <CommissionsRow key={commission.id} commissionData={commission} />
          );
        }
      })}
    </>
  );
};
