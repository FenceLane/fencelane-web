import { OrderInfo } from "../types";

export const orderFilters = (
  filters: {
    dateStart: string;
    dateEnd: string;
    specificDate: string;
    search: string;
  },
  order: OrderInfo
) => {
  {
    let dateBool = true;
    const orderDate = new Date(order.createdAt);
    orderDate.setHours(0, 0, 0, 0);

    if (filters.dateStart && filters.dateEnd) {
      const dateStart = new Date(filters.dateStart);
      const dateEnd = new Date(filters.dateEnd);
      dateStart.setHours(0, 0, 0, 0);
      dateEnd.setHours(0, 0, 0, 0);
      if (orderDate < dateStart || orderDate > dateEnd) {
        dateBool = false;
      }
    }

    if (filters.specificDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
      const firstDayOfThisMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );
      const firstDayOfLastMonth = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        1
      );
      const lastDayOfLastMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        0
      );
      const threeMonthsAgo = new Date(
        new Date().setMonth(new Date().getMonth() - 3)
      );
      switch (filters.specificDate) {
        case "today":
          if (orderDate.getDate() !== today.getDate()) {
            dateBool = false;
          }
          break;
        case "yesterday":
          if (orderDate.getDate() !== yesterday.getDate()) {
            dateBool = false;
          }
          break;
        case "this-month":
          if (orderDate < firstDayOfThisMonth) {
            dateBool = false;
          }
          break;
        case "last-month":
          if (
            orderDate < firstDayOfLastMonth ||
            orderDate > lastDayOfLastMonth
          ) {
            dateBool = false;
          }
          break;
        case "last-three-months":
          if (orderDate < threeMonthsAgo) {
            dateBool = false;
          }
          break;
      }
    }

    const clientBool = order.destination.client.name
      .toLowerCase()
      .includes(filters.search);

    const parentOrderBool = String(order.parentOrderId)
      .toLowerCase()
      .includes(filters.search);

    const destinationBool =
      order.destination.address.toLowerCase().includes(filters.search) ||
      order.destination.city.toLowerCase().includes(filters.search) ||
      order.destination.country.toLowerCase().includes(filters.search) ||
      order.destination.postalCode.toLowerCase().includes(filters.search);

    const orderIdBool = order.id === Number(filters.search);
    return (
      dateBool &&
      (clientBool ||
        destinationBool ||
        parentOrderBool ||
        orderIdBool ||
        filters.search === "")
    );
  }
};
