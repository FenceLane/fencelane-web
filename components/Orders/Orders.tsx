import React from "react";
import { Text } from "@chakra-ui/react";
import { OrderInfo } from "../../lib/types";
import { useContent } from "../../lib/hooks/useContent";
interface OrderProps {
  orders: OrderInfo[];
}

const initialFilters = {
  dateStart: "",
  dateEnd: "",
  specificDate: "",
  search: "",
};

export const Orders = ({ orders }: OrderProps) => {
  const { t } = useContent();

  return (
    <>
      <Text color="var(--dark)" fontSize="20px" fontWeight="500" m="10px">
        {t("pages.orders.order_history")}
      </Text>
    </>
  );
};
