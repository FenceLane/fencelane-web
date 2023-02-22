import { useGetProducts } from "../../../lib/api/hooks/products";
import { useContent } from "../../../lib/hooks/useContent";
import { mapAxiosErrorToLabel } from "../../../lib/server/BackendError/BackendError";
import { Storage } from "../Storage/Storage";

export const StorageWrapper = () => {
  const { t } = useContent("errors.backendErrorLabel");

  const { isError, error, isLoading, data } = useGetProducts();

  if (isLoading) return <p>Loading...</p>;

  if (isError) return <p>{t(mapAxiosErrorToLabel(error))}</p>;

  return <Storage products={data} />;
};
