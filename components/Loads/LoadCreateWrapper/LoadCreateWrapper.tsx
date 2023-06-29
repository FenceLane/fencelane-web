import { Flex } from "@chakra-ui/react";
import { useGetClients } from "../../../lib/api/hooks/orders";
import { useGetProducts } from "../../../lib/api/hooks/products";
import { useContent } from "../../../lib/hooks/useContent";
import { mapAxiosErrorToLabel } from "../../../lib/server/BackendError/BackendError";
import { LoadingAnimation } from "../../LoadingAnimation/LoadingAnimation";
import { LoadCreate } from "./LoadCreate/LoadCreate";

export const LoadCreateWrapper = () => {
  const { t } = useContent("errors.backendErrorLabel");

  const {
    isError: isClientsError,
    error: clientsError,
    isLoading: isClientsLoading,
    data: clients,
  } = useGetClients();

  const {
    isError: isProductsError,
    error: productsError,
    isLoading: isProductsLoading,
    data: products,
  } = useGetProducts();

  if (isProductsLoading || isClientsLoading)
    return (
      <Flex justifyContent="center" alignItems="center" height="100%">
        <LoadingAnimation />
      </Flex>
    );

  if (isClientsError || isProductsError)
    return (
      <p>
        {isClientsError && t(mapAxiosErrorToLabel(clientsError))}
        {isProductsError && t(mapAxiosErrorToLabel(productsError))}
      </p>
    );

  return <LoadCreate clients={clients.data} products={products} />;
};
