import { CategoryInfo, ProductInfo } from "../types";

export default function sumStockByCategory(
  productsData: ProductInfo[],
  allCategories: CategoryInfo[]
) {
  const stockByCategory: {
    [key: string]: { percentage: number; color: string; title: string };
  } = {};

  // Inicjalizacja stocku dla wszystkich kategorii na zero
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
