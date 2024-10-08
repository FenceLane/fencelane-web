import React, { useEffect, useRef, useState } from "react";
import { Box, ModalOverlay, WrapItem, useDisclosure } from "@chakra-ui/react";
import { useOnClickOutside } from "../../../../../../lib/hooks/useOnClickOutside";
import { useContent } from "../../../../../../lib/hooks/useContent";
import { useIsMobile } from "../../../../../../lib/hooks/useIsMobile";
import { ProductInfo } from "../../../../../../lib/types";
import {
  Modal,
  ModalContent,
  Input,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  ModalFooter,
  Flex,
  Text,
} from "@chakra-ui/react";
import { useUpdateCommissionProducts } from "../../../../../../lib/api/hooks/commissions";
import { mapAxiosErrorToLabel } from "../../../../../../lib/server/BackendError/BackendError";

interface ActionButtonsProps {
  commissionId: number;
  product: {
    id: string;
    commissionId: number;
    productId: string;
    quantity: number;
    createdAt: string;
    updatedAt: string;
    product: ProductInfo;
  };
}

export const ActionsButtons = ({
  commissionId,
  product,
}: ActionButtonsProps) => {
  const { t } = useContent();

  const isMobile = useIsMobile();

  const ref = useRef<HTMLDivElement | null>(null);

  useOnClickOutside(ref, () => setShowDropdown(false));

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [showDropdown, setShowDropdown] = useState(false);

  const toggleShowDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const [completedQuantity, setCompletedQuantity] = useState(0);

  const {
    mutate: updateCommission,
    error: updateCommissionError,
    isError: isUpdateCommissionError,
    isSuccess: isUpdateCommissionSuccess,
    isLoading: isUpdateCommissionLoading,
  } = useUpdateCommissionProducts(commissionId);

  const handleCompleteProduct = () => {
    const updateProduct = [
      {
        filledQuantity: product.quantity,
        productCommissionId: product.id,
      },
    ];
    updateCommission(updateProduct);
  };

  const handleCompletePartProduct = () => {
    const updateProduct = [
      {
        filledQuantity: completedQuantity,
        productCommissionId: product.id,
      },
    ];
    updateCommission(updateProduct);
  };

  useEffect(() => {
    if (isUpdateCommissionSuccess) {
      onClose();
      setShowDropdown(false);
    }
  }, [isUpdateCommissionSuccess, onClose]);

  return (
    <>
      {isMobile && (
        <Box position="relative" ref={ref}>
          <Button aria-label="more button" onClick={toggleShowDropdown}>
            ...
          </Button>
          <Box
            bg="white"
            p="10px 3px"
            borderRadius="5px"
            position="absolute"
            top="40px"
            right="0"
            boxShadow="6px 6px 6px -7px rgba(66, 68, 90, 1)"
            display={showDropdown ? "block" : "none"}
            zIndex="10"
          >
            <Flex w="100%" gap="10px" flexDir="column" p="5px">
              <WrapItem w="100%">
                <Button colorScheme="blue" variant="outline" onClick={onOpen}>
                  {t("buttons.complete_part")}
                </Button>
              </WrapItem>
              <WrapItem w="100%">
                <Button
                  colorScheme="blue"
                  w="100%"
                  onClick={handleCompleteProduct}
                  isLoading={isUpdateCommissionLoading}
                >
                  {t("buttons.complete")}
                </Button>
              </WrapItem>
            </Flex>
          </Box>
        </Box>
      )}

      {!isMobile && (
        <>
          <Button colorScheme="blue" variant="outline" onClick={onOpen}>
            {t("buttons.complete_part")}
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleCompleteProduct}
            isLoading={isUpdateCommissionLoading}
          >
            {t("buttons.complete")}
          </Button>
        </>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("pages.commissions.product_completing")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {t("pages.commissions.insert_completing_product_quantity")}
            <Input
              placeholder="Paczki"
              type="number"
              mt="20px"
              onChange={(e) => setCompletedQuantity(Number(e.target.value))}
            />
            {isUpdateCommissionError && (
              <Text color="red">
                {t(
                  `errors.backendErrorLabel.${mapAxiosErrorToLabel(
                    updateCommissionError
                  )}`
                )}
              </Text>
            )}
          </ModalBody>
          <ModalFooter alignItems="flex-end">
            <Button
              type="submit"
              colorScheme="green"
              isLoading={isUpdateCommissionLoading}
              onClick={handleCompletePartProduct}
              mr={3}
            >
              {t("buttons.confirm")}
            </Button>
            <Button colorScheme="red" onClick={onClose}>
              {t("buttons.cancel")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
