import { CommissionInfo, ProductInfo } from "../types";

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

export const sortProducts = (a: ProductInfo, b: ProductInfo) => {
  {
    if (a.category.name < b.category.name) {
      return -1;
    }
    if (a.category.name > b.category.name) {
      return 1;
    }
    if (a.dimensions < b.dimensions) {
      return -1;
    }
    if (a.dimensions > b.dimensions) {
      return 1;
    }
    if (a.variant > b.variant) {
      return -1;
    } else {
      return 1;
    }
  }
};

// .sort((a, b) => sortProducts(a, b))
