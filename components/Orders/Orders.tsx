import React from "react";
import { OrderInfo } from "../../lib/types";
import { OrdersRow } from "./OrdersRow/OrdersRow";
// import styles from "./Orders.module.scss";

interface OrderProps {
  orders: OrderInfo;
}

export const Orders = ({ orders }: OrderProps) => {
  return (
    <>
      {Object.values(orders)[0].map((order: any) => (
        <OrdersRow key={order.products[0].orderId} orderData={order} />
      ))}
    </>
  );
};
