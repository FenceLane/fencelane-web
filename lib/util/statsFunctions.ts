import {
  CategoryInfo,
  OrderInfo,
  OrderProductInfo,
  ProductInfo,
} from "../types";

export const months: string[] = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

export function calculateTotalVolumeForOrders(orders: OrderInfo[]): number {
  let totalVolume = 0;

  orders.forEach((orderInfo) => {
    orderInfo.products.forEach((product) => {
      const {
        quantity,
        product: { volumePerPackage },
      } = product;
      const volume = quantity * parseFloat(volumePerPackage);
      totalVolume += volume;
    });
  });

  return totalVolume;
}

export function countUniqueClients(orders: OrderInfo[]): number {
  const uniqueClients = new Set<string>();

  orders.forEach((orderInfo) => {
    uniqueClients.add(orderInfo.destination.clientId);
  });

  return uniqueClients.size;
}

export function calculateAverageProfit(orders: OrderInfo[]): number {
  const profits = orders
    .filter((orderInfo) => orderInfo.profit !== null)
    .map((orderInfo) => Number(orderInfo.profit));

  if (profits.length === 0) {
    return 0;
  }

  const totalProfit = profits.reduce((sum, profit) => sum + profit, 0);
  const averageProfit = totalProfit / profits.length;
  return averageProfit;
}

export function sumStockByCategory(
  productsData: ProductInfo[],
  allCategories: CategoryInfo[]
) {
  const stockByCategory: {
    [key: string]: { percentage: number; color: string; title: string };
  } = {};

  allCategories.forEach((category) => {
    stockByCategory[category.name] = {
      percentage: 0,
      color: category.color,
      title: category.name,
    };
  });

  productsData.forEach((product) => {
    const categoryName = product.category.name;
    const stock = product.stock;
    const color = product.category.color;

    stockByCategory[categoryName].percentage += stock;
  });

  const totalStock = Object.values(stockByCategory).reduce(
    (total, category) => total + category.percentage,
    0
  );

  const stockPercentageByCategory: {
    title: string;
    color: string;
    percentage: number;
  }[] = [];

  Object.entries(stockByCategory).forEach(([categoryName, category]) => {
    const percentage = ((category.percentage / totalStock) * 100).toFixed(2);
    stockPercentageByCategory.push({
      title: categoryName,
      color: category.color,
      percentage: parseFloat(percentage),
    });
  });

  stockPercentageByCategory.sort((a, b) => b.percentage - a.percentage);

  return stockPercentageByCategory;
}

export function getMonthByNumber(month: number) {
  let month_id = month;
  if (month_id < 0) {
    month_id = month_id + 12;
  }
  return months[month_id];
}

export const dateMaxFunction = (selectedDate: Date) => {
  const dateMax = new Date(selectedDate);
  dateMax.setMonth(dateMax.getMonth() + 1);
  dateMax.setDate(0);
  return dateMax;
};

export const dateMinFunction = (dateMax: Date) => {
  const dateMin = new Date(dateMax);
  dateMin.setMonth(dateMin.getMonth() - 5);
  dateMin.setDate(1);
  return dateMin;
};

export const profitMonthBeforeFunction = (
  orders: OrderInfo[],
  selectedDate: Date
) => {
  return Number(
    orders
      .filter((order) => {
        const orderDate = new Date(order.createdAt);
        if (selectedDate.getMonth() === 0) {
          return (
            orderDate.getMonth() === 11 &&
            orderDate.getFullYear() === selectedDate.getFullYear() - 1
          );
        } else {
          return (
            orderDate.getMonth() === selectedDate.getMonth() - 1 &&
            orderDate.getFullYear() === selectedDate.getFullYear()
          );
        }
      })
      .reduce((acc, current) => {
        if (current.profit) {
          return (acc += Number(current.profit));
        } else {
          return acc;
        }
      }, 0)
      .toFixed(2)
  );
};

export const profitFunction = (orders: OrderInfo[], selectedDate: Date) => {
  return Number(
    orders
      .filter((order) => {
        const orderDate = new Date(order.createdAt);
        return (
          orderDate.getMonth() === selectedDate.getMonth() &&
          orderDate.getFullYear() === selectedDate.getFullYear()
        );
      })
      .reduce((acc, current) => {
        if (current.profit) {
          return (acc += Number(current.profit));
        } else {
          return acc;
        }
      }, 0)
      .toFixed(2)
  );
};

export const percentageRatioFunction = (
  profitMonthBefore: number,
  profit: number
) => {
  if (profitMonthBefore !== 0) {
    return Number(((profit / profitMonthBefore) * 100 - 100).toFixed(2));
  } else if (profit === 0) {
    return 0;
  } else {
    return Infinity;
  }
};

export const stonksFunction = (percentageRatio: number) => {
  let stonks = true;

  if (percentageRatio < 0) {
    stonks = false;
    percentageRatio = Math.abs(percentageRatio);
  }
  return stonks;
};

export const monthBeforeFunction = (month: number) => {
  if (month - 1 >= 0) {
    return month - 1;
  } else {
    return 11;
  }
};

export const sixMonthsOrdersFunction = (
  orders: OrderInfo[],
  dateMin: Date,
  dateMax: Date
) => {
  return orders
    .filter((order) => {
      return (
        new Date(order.createdAt) > dateMin &&
        new Date(order.createdAt) < dateMax
      );
    })
    .map((order) => {
      const calcIncome = (product: OrderProductInfo) => {
        return (
          product.quantity *
          Number(product.product.volumePerPackage) *
          Number(product.price)
        );
      };
      return {
        created: new Date(order.createdAt).getMonth(),
        incomes: order.products.reduce(
          (acc, product) => acc + calcIncome(product),
          0
        ),
        profit: order.profit ? Number(order.profit) : 0,
      };
    });
};

interface DataObject {
  created: number;
  incomes: number;
  profit: number;
}

interface GroupedData {
  [month: number]: {
    incomes: number;
    costs: number;
    profit: number;
  };
}

export const groupDataByMonthFunction = (
  data: DataObject[],
  selectedDate: number,
  incomes: string,
  costs: string,
  profit: string
) => {
  const groupedData: GroupedData = {};

  for (let i = 5; i >= 0; i--) {
    let month: number = selectedDate - i;
    groupedData[month] = { incomes: 0, costs: 0, profit: 0 };
  }

  for (const obj of data) {
    const { created, incomes, profit } = obj;

    if (created >= selectedDate - 6 && created <= selectedDate) {
      if (!groupedData[created]) {
        groupedData[created] = { incomes: 0, costs: 0, profit: 0 };
      }

      groupedData[created].incomes += incomes;
      groupedData[created].costs =
        groupedData[created].incomes - groupedData[created].profit;
      groupedData[created].profit += profit;
    }
  }

  let sortedEntries = Object.entries(groupedData).sort(
    ([a], [b]) => Number(a) - Number(b)
  );

  sortedEntries = sortedEntries.map((entry) => {
    let newEntry = Number(entry[0]);
    if (newEntry < 0) {
      newEntry += 12;
    }
    return [String(newEntry), entry[1]];
  });

  const FinancesSeries = [
    {
      name: incomes,
      data: sortedEntries.map(([_, { incomes }]) =>
        Number((incomes / 1000 + 0.01).toFixed(2))
      ),
    },
    {
      name: costs,
      data: sortedEntries.map(([_, { costs }]) =>
        Number((costs / 1000 + 0.01).toFixed(2))
      ),
    },
    {
      name: profit,
      data: sortedEntries.map(([_, { profit }]) =>
        Number((profit / 1000 + 0.01).toFixed(2))
      ),
    },
  ];

  return FinancesSeries;
};

export const statsDateFunction = (selectedMonth: number) => {
  const date = new Date();
  const currentDate = new Date();

  date.setMonth(selectedMonth);
  if (date.getMonth() > currentDate.getMonth()) {
    date.setFullYear(new Date().getFullYear() - 1);
  } else {
    date.setFullYear(new Date().getFullYear());
  }

  date.setDate(1);
  return date;
};

export const monthOrdersFunction = (orders: OrderInfo[], date: Date) => {
  return orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    return orderDate.getMonth() === date.getMonth();
  });
};
