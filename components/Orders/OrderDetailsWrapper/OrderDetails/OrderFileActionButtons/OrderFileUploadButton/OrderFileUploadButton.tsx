import { FormLabel, Input, Spinner, Text } from "@chakra-ui/react";
import { useContent } from "../../../../../../lib/hooks/useContent";
import { usePostOrderFile } from "../../../../../../lib/api/hooks/orders";
import { mapAxiosErrorToLabel } from "../../../../../../lib/server/BackendError/BackendError";
import styles from "./OrderFileUploadButton.module.scss";

interface FileUploadButtonProps {
  orderId: number;
}

export const OrderFileUploadButton = ({ orderId }: FileUploadButtonProps) => {
  const { t } = useContent();

  const {
    mutate: uploadFile,
    error: error,
    isLoading,
  } = usePostOrderFile(orderId);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files) {
      e.target.value = "";
      return;
    }
    //send files as form data with post request
    const formData = new FormData();

    Array.from(files).forEach((file) => {
      formData.append(`file_${file.name}`, file);
    });

    uploadFile(formData);
    e.target.value = "";
  };

  return (
    <>
      {!!error && (
        <Text fontSize="sm" color="red">
          {t(`errors.backendErrorLabel.${mapAxiosErrorToLabel(error)}`)}
        </Text>
      )}
      <FormLabel
        cursor="pointer"
        color="white"
        bg={isLoading ? "var(--grey)" : "var(--button-dark-orange)"}
        fontWeight="400"
        borderRadius="md"
        w={100}
        h={10}
        textAlign="center"
        _hover={{ opacity: 0.7 }}
        alignItems="center"
        display="flex"
        justifyContent="center"
      >
        {isLoading ? <Spinner /> : <span>{t("buttons.add")}</span>}
        <span className={styles.visuallyHidden}>
          <Input
            disabled={isLoading}
            type="file"
            multiple={true}
            onChange={handleFileInputChange}
          />
        </span>
      </FormLabel>
    </>
  );
};
