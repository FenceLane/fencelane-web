import { CategoryInfo, OrderInfo, ProductInfo } from "../types";

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
  const months: string[] = [
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
  return months[month_id];
}
