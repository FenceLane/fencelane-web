import { Flex } from "@chakra-ui/react";
import {
  useGetClients,
  useGetDestinations,
} from "../../../lib/api/hooks/orders";
import { useGetProducts } from "../../../lib/api/hooks/products";
import { useContent } from "../../../lib/hooks/useContent";
import { mapAxiosErrorToLabel } from "../../../lib/server/BackendError/BackendError";
import { LoadingAnimation } from "../../LoadingAnimation/LoadingAnimation";
import { OrderCreate } from "./OrderCreate/OrderCreate";

export const OrderCreateWrapper = () => {
  const { t } = useContent("errors.backendErrorLabel");

  const {
    isError: isClientsError,
    error: clientsError,
    isLoading: isClientsLoading,
    data: clients,
  } = useGetClients();

  const {
    isError: isDestinationsError,
    error: destinationsError,
    isLoading: isDestinationsLoading,
    data: destinations,
  } = useGetDestinations();

  const {
    isError: isProductsError,
    error: productsError,
    isLoading: isProductsLoading,
    data: products,
  } = useGetProducts();

  if (isProductsLoading || isDestinationsLoading || isClientsLoading)
    return (
      <Flex justifyContent="center" alignItems="center" height="100%">
        <LoadingAnimation></LoadingAnimation>
      </Flex>
    );

  if (isClientsError || isDestinationsError || isProductsError)
    return (
      <p>
        {isClientsError && t(mapAxiosErrorToLabel(clientsError))}
        {isDestinationsError && t(mapAxiosErrorToLabel(destinationsError))}
        {isProductsError && t(mapAxiosErrorToLabel(productsError))}
      </p>
    );

  return (
    <OrderCreate
      clients={clients}
      destinations={destinations}
      products={products}
    />
  );
};
