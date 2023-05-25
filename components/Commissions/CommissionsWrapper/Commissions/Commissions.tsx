import React from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
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
  return (
    <>
      <Text color="var(--dark)" fontSize="20px" fontWeight="500" m="10px">
        Zlecenia
      </Text>
      <Flex justifyContent="flex-end">
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
      {commissions.map((commission) => (
        <CommissionsRow key={commission.id} commissionData={commission} />
      ))}
    </>
  );
};
