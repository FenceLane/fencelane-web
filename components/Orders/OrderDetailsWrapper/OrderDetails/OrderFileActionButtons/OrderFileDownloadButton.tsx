import { Button } from "@chakra-ui/react";
import { FileInfo } from "../../../../../lib/types";
import { useContent } from "../../../../../lib/hooks/useContent";
import { downloadFile } from "../../../../../lib/util/fileUtils";

interface FileDownloadButtonProps {
  file: FileInfo;
}
export const OrderFileDownloadButton = ({ file }: FileDownloadButtonProps) => {
  const { t } = useContent();

  return (
    <Button
      bg="var(--button-green)"
      color="white"
      fontWeight="400"
      mx={2}
      onClick={(e) => {
        e.preventDefault();
        downloadFile(file.url, file.key);
      }}
    >
      {t("pages.orders.order.download")}
    </Button>
  );
};
