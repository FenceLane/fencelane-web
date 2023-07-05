import { Button } from "@chakra-ui/react";
import { FileInfo } from "../../../../../lib/types";
import { useContent } from "../../../../../lib/hooks/useContent";

interface FileDeleteButtonProps {
  orderId: number;
  file: FileInfo;
  onDeleteClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isLoading: boolean;
}

export const OrderFileDeleteButton = ({
  orderId,
  file,
  onDeleteClick,
  isLoading,
}: FileDeleteButtonProps) => {
  const { t } = useContent();

  return (
    <>
      <Button
        onClick={onDeleteClick}
        mx={2}
        bg="var(--button-orange)"
        color="white"
        fontWeight="400"
        isLoading={isLoading}
      >
        {t("buttons.delete")}
      </Button>
    </>
  );
};
