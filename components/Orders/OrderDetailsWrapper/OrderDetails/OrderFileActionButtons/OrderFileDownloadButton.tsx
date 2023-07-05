import { Button } from "@chakra-ui/react";
import { FileInfo } from "../../../../../lib/types";
import { downloadFile } from "../../../../../lib/util/fileUtils";
import { useContent } from "../../../../../lib/hooks/useContent";

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
