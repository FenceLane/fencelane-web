import { Button } from "@chakra-ui/react";
import { useContent } from "../../../../../lib/hooks/useContent";

interface FileDeleteButtonProps {
  onDeleteClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isLoading: boolean;
}

export const OrderFileDeleteButton = ({
  onDeleteClick,
  isLoading,
}: FileDeleteButtonProps) => {
  const { t } = useContent();

  return (
    <>
      <Button
        mb="10px"
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
