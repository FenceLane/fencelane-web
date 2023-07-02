import { CommissionInfo } from "../types";

export function sumQuantityByCategory(commissionInfo: CommissionInfo): {
  [categoryName: string]: number;
} {
  const quantityByCategory: { [categoryName: string]: number } = {};

  for (const product of commissionInfo.products) {
    const categoryName = product.product.category.name;
    const quantity = product.quantity;

    if (quantityByCategory.hasOwnProperty(categoryName)) {
      quantityByCategory[categoryName] += quantity;
    } else {
      quantityByCategory[categoryName] = quantity;
    }
  }

  return quantityByCategory;
}
