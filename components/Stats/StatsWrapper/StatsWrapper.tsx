import React from "react";
import { Stats } from "../Stats/Stats";
import { Flex } from "@chakra-ui/react";
import { useGetOrders } from "../../../lib/api/hooks/orders";
import { useContent } from "../../../lib/hooks/useContent";
import { mapAxiosErrorToLabel } from "../../../lib/server/BackendError/BackendError";
import { LoadingAnimation } from "../../LoadingAnimation/LoadingAnimation";
import {
  useGetProducts,
  useGetProductsCategories,
} from "../../../lib/api/hooks/products";

export const StatsWrapper = () => {
  const { t } = useContent("errors.backendErrorLabel");

  const {
    isError: isOrdersError,
    error: ordersError,
    isLoading: isOrdersLoading,
    data: ordersData,
  } = useGetOrders();

  const {
    isError: isProductsError,
    error: productsError,
    isLoading: isProductsLoading,
    data: productsData,
  } = useGetProducts();

  const {
    error: categoriesError,
    isError: isCategoriesError,
    isLoading: isCategoriesLoading,
    data: productsCategories,
  } = useGetProductsCategories();

  if (isOrdersLoading || isProductsLoading || isCategoriesLoading)
    return (
      <Flex justifyContent="center" alignItems="center" height="100%">
        <LoadingAnimation></LoadingAnimation>
      </Flex>
    );

  if (isOrdersError || isProductsError || isCategoriesError)
    return (
      <p>
        {t(mapAxiosErrorToLabel(ordersError))}{" "}
        {t(mapAxiosErrorToLabel(productsError))}{" "}
        {t(mapAxiosErrorToLabel(categoriesError))}
      </p>
    );

  return (
    <Stats
      orders={ordersData}
      products={productsData}
      categories={productsCategories}
    />
  );
};
