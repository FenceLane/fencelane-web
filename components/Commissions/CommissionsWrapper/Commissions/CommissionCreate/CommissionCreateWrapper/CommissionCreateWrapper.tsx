import { Flex } from "@chakra-ui/react";
import { useContent } from "../../../../../../lib/hooks/useContent";
import { mapAxiosErrorToLabel } from "../../../../../../lib/server/BackendError/BackendError";
import { LoadingAnimation } from "../../../../../LoadingAnimation/LoadingAnimation";
import { CommissionCreate } from "../CommissionCreate";
import { useGetProducts } from "../../../../../../lib/api/hooks/products";

export const CommissionCreateWrapper = () => {
  const { t } = useContent("errors.backendErrorLabel");

  const {
    isError: isProductsError,
    error: productsError,
    isLoading: isProductsLoading,
    data: products,
  } = useGetProducts();

  if (isProductsLoading)
    return (
      <Flex justifyContent="center" alignItems="center" height="100%">
        <LoadingAnimation />
      </Flex>
    );

  if (isProductsError)
    return <p>{isProductsError && t(mapAxiosErrorToLabel(productsError))}</p>;

  return <CommissionCreate products={products} />;
};
