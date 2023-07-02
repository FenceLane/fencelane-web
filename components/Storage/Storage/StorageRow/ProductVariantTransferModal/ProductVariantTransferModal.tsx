import React, { useState } from "react";
import { mapAxiosErrorToLabel } from "../../../../../lib/server/BackendError/BackendError";
import {
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  Select,
  Box,
} from "@chakra-ui/react";
import { useTransferVariant } from "../../../../../lib/api/hooks/products";
import { ProductInfo, PRODUCT_VARIANT } from "../../../../../lib/types";
import { useContent } from "../../../../../lib/hooks/useContent";

interface ProductVariantTransferModalProps {
  isVariantTransferOpen: boolean;
  onVariantTransferClose: Function;
  product: ProductInfo;
}

export const ProductVariantTransferModal = ({
  isVariantTransferOpen,
  onVariantTransferClose,
  product,
}: ProductVariantTransferModalProps) => {
  const { t } = useContent();

  const [newVariant, setNewVariant] = useState(product.variant);

  const [quantity, setQuantity] = useState(0);

  const handleTransferVariant = () => {
    transferVariant({
      id: product.id,
      data: { amount: quantity, variant: newVariant },
    });
  };

  const handleVariantTransferClose = () => {
    setNewVariant(product.variant);
    setQuantity(0);
    onVariantTransferClose();
  };

  const {
    mutate: transferVariant,
    error: transferVariantError,
    isLoading: isTransferVariantLoading,
  } = useTransferVariant(handleVariantTransferClose);

  const handleVariantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewVariant(e.target.value as PRODUCT_VARIANT);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(e.target.value));
  };

  return (
    <Modal isOpen={isVariantTransferOpen} onClose={handleVariantTransferClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("pages.storage.modals.variant_transfer")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontWeight="600">{product.category.name}</Text>
          <Text fontWeight="600">{product.dimensions}</Text>
          <Text fontWeight="600" mb="20px">
            {t(`pages.storage.variants.${product.variant}`)}
          </Text>
          <label>{t("pages.storage.modals.choose_new_variant")}</label>
          <Select
            onChange={handleVariantChange}
            defaultValue={product.variant}
            mb="20px"
          >
            <option value={PRODUCT_VARIANT.WHITE_WET}>
              {t("pages.storage.variants.white_wet")}
            </option>
            <option value={PRODUCT_VARIANT.WHITE_DRY}>
              {t("pages.storage.variants.white_dry")}
            </option>
            <option value={PRODUCT_VARIANT.BLACK}>
              {t("pages.storage.variants.black")}
            </option>
          </Select>
          <label>{t("pages.storage.modals.quantity")}</label>
          <Input
            name="quantity"
            type="number"
            value={quantity === 0 ? "" : quantity}
            onChange={handleQuantityChange}
          />
          {!!transferVariantError && (
            <Text color="red">
              {t(
                `errors.backendErrorLabel.${mapAxiosErrorToLabel(
                  transferVariantError
                )}`
              )}
            </Text>
          )}
        </ModalBody>
        <ModalFooter justifyContent="space-between">
          <Box>
            <Button
              colorScheme="blue"
              onClick={handleTransferVariant}
              mr={3}
              isLoading={isTransferVariantLoading}
            >
              {t("buttons.confirm")}
            </Button>
            <Button colorScheme="gray" onClick={handleVariantTransferClose}>
              {t("pages.storage.buttons.cancel")}
            </Button>
          </Box>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
