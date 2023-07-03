import React from "react";
import ParentOrders from "../ParentOrders";
import { useGetOrdersByParentOrderId } from "../../../lib/api/hooks/orders";

export default function ParentOrdersWrapper() {
  const { isError, error, isLoading, data } = useGetOrdersByParentOrderId();
  return (
    <div>
      <ParentOrders />
    </div>
  );
}
