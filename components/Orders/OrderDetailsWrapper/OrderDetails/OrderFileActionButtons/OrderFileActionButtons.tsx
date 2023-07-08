import { Text } from "@chakra-ui/react";
import { useDeleteOrderFile } from "../../../../../lib/api/hooks/orders";
import { FileInfo } from "../../../../../lib/types";
import { OrderFileDeleteButton } from "./OrderFileDeleteButton";
import { OrderFileDownloadButton } from "./OrderFileDownloadButton";
import { mapAxiosErrorToLabel } from "../../../../../lib/server/BackendError/BackendError";
import { useContent } from "../../../../../lib/hooks/useContent";

interface OrderFileActionButtonsProps {
  file: FileInfo;
  orderId: number;
}
export const OrderFileActionButtons = ({
  file,
  orderId,
}: OrderFileActionButtonsProps) => {
  const { t } = useContent();

  const {
    mutate: deleteOrderFile,
    error,
    isLoading,
  } = useDeleteOrderFile(orderId, file.key);

  const handleFileDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    deleteOrderFile();
  };

  return (
    <>
      <OrderFileDownloadButton file={file} />
      <OrderFileDeleteButton
        onDeleteClick={handleFileDelete}
        isLoading={isLoading}
      />
      {!!error && (
        <Text fontSize="sm" mt={4} color="red">
          {t(`errors.backendErrorLabel.${mapAxiosErrorToLabel(error)}`)}
        </Text>
      )}
    </>
  );
};
