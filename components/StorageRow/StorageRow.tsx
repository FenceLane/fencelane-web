import React, { useRef, useState } from "react";
import {
  Text,
  Tr,
  Td,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
} from "@chakra-ui/react";
import { useOnClickOutside } from "../../lib/hooks/useOnClickOutside";
import styles from "./StorageRow.module.scss";
import { EditIcon } from "@chakra-ui/icons";
import { apiClient } from "../../lib/api/apiClient";
import { ProductInfo } from "../../lib/types";
import { useContent } from "../../lib/hooks/useContent";

const commodityColor = (commodity: String) => {
  if (commodity === "Palisada okorowana") return "#805AD5";
  if (commodity === "Palisada cylindryczna") return "#D53F8C";
  if (commodity === "Palisada nieokorowana") return "#DBC234";
  if (commodity === "Palisada prostokątna") return "#38A169";
  if (commodity === "Słupek bramowy") return "#EF7F18";
  return "#777777";
};

const handleDelete = (id: React.Key) => {
  apiClient.products.deleteProduct(id);
  window.location.reload();
};

interface StorageRowProps {
  product: ProductInfo;
}

export const StorageRow = ({ product }: StorageRowProps) => {
  const { t } = useContent();
  const [editedValues, setEditedValues] = useState(product);
  const [showOptions, setShowOptions] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(ref, () => setShowOptions(false));
  const {
    isOpen: isDeletingOpen,
    onOpen: onDeletingOpen,
    onClose: onDeletingClose,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  return (
    <>
      <Tr className={styles["commodity-table-row"]} key={product.id}>
        <Td>
          <Text
            as="span"
            bg={commodityColor(product.name)}
            color="white"
            p="3px 6px"
            borderRadius="6px"
            textAlign="center"
          >
            {product.name}
          </Text>
        </Td>
        <Td>{product.dimensions}</Td>
        <Td>{t(`pages.storage.variants.${String(product.variant)}`)}</Td>
        <Td>{String(product.itemsPerPackage)}</Td>
        <Td>{String(product.volumePerPackage)}</Td>
        <Td>{String(product.itemsPerPackage * product.stock)}</Td>
        <Td>{String(product.stock)}</Td>
        <Td>
          <Button
            w={8}
            h={8}
            bg="white"
            onClick={() => setShowOptions(!showOptions)}
          >
            <EditIcon
              w="28px"
              h="28px"
              color={commodityColor(product.name)}
            ></EditIcon>
          </Button>
        </Td>
        {/* <Box
          display={showOptions ? "block" : "none"}
          position="absolute"
          top="0"
          right="10px"
          className={styles["bottom-row"]}
          zIndex="10"
          bg="white"
          ref={ref}
        >
          <Flex justifyContent="right" gap="5px" flexDir="column">
            <Button
              variant="outline"
              colorScheme="blue"
              height="30px"
              fontSize="13px"
              onClick={onEditOpen}
            >
              Modyfikuj
            </Button>
            <Button
              variant="outline"
              colorScheme="red"
              height="30px"
              fontSize="13px"
              onClick={onDeletingOpen}
            >
              Usuń
            </Button>
          </Flex>
        </Box> */}
      </Tr>

      <Modal
        isOpen={isEditOpen}
        onClose={() => {
          onEditClose(), setEditedValues(product);
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modyfikowanie towaru</ModalHeader>
          <ModalCloseButton />
          <ModalBody className={styles["modal-inputs"]}>
            <Input
              placeholder="Nazwa towaru"
              value={String(editedValues.name)}
              onChange={(event) =>
                setEditedValues({ ...editedValues, name: event.target.value })
              }
            />
            <Input
              placeholder="Wymiary"
              value={String(editedValues.dimensions)}
              onChange={(event) =>
                setEditedValues({
                  ...editedValues,
                  dimensions: event.target.value,
                })
              }
            />
            <Input
              placeholder="Ilość w M3"
              type="number"
              value={editedValues.volumePerPackage}
              onChange={(event) =>
                setEditedValues({
                  ...editedValues,
                  volumePerPackage: +event.target.value,
                })
              }
            />
            <Input
              placeholder="Pakowanie"
              value={editedValues.itemsPerPackage}
              onChange={(event) =>
                setEditedValues({
                  ...editedValues,
                  itemsPerPackage: +event.target.value,
                })
              }
            />
            <Input
              type="number"
              placeholder="Ilość pakietów"
              value={String(editedValues.stock)}
              onChange={(event) =>
                setEditedValues({
                  ...editedValues,
                  stock: Number(event.target.value),
                })
              }
            />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={() => console.log(editedValues)}
              mr={3}
            >
              Modyfikuj
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                onEditClose(), setEditedValues(product);
              }}
            >
              Anuluj
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isDeletingOpen} onClose={onDeletingClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Usuwanie towaru</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Czy na pewno chcesz usunąć ten towar?</ModalBody>
          <ModalFooter>
            <Button
              colorScheme="red"
              onClick={() => handleDelete(product.id)}
              mr={3}
            >
              Usuń
            </Button>
            <Button colorScheme="green" onClick={onDeletingClose}>
              Anuluj
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
