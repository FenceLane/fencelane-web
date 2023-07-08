import { Button } from "@chakra-ui/react";
import { FileInfo } from "../../../../../lib/types";
import { toastError } from "../../../../../lib/util/toasts";
import { useContent } from "../../../../../lib/hooks/useContent";
import { useState } from "react";
import { downloadAllFiles } from "../../../../../lib/util/fileUtils";

interface OrderDownloadAllFilesButtonProps {
  orderId: number;
  files: FileInfo[];
}

export const OrderDownloadAllFilesButton = ({
  orderId,
  files,
}: OrderDownloadAllFilesButtonProps) => {
  const { t } = useContent();

  const [isDownloading, setIsDownloading] = useState(false);

  const handleClick = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    try {
      setIsDownloading(true);
      await downloadAllFiles(files, orderId);
    } catch (error) {
      toastError(t("pages.orders.order.files-download-error"));
    }
    setIsDownloading(false);
  };

  return (
    <Button
      onClick={handleClick}
      bg="var(--button-green)"
      color="white"
      fontWeight="400"
      isLoading={isDownloading}
      isDisabled={files.length < 1}
    >
      {t("pages.orders.order.download-all")}
    </Button>
  );
};
