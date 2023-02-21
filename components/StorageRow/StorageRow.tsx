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
  Select,
} from "@chakra-ui/react";
import { useOnClickOutside } from "../../lib/hooks/useOnClickOutside";
import styles from "./StorageRow.module.scss";
import { EditIcon, CloseIcon } from "@chakra-ui/icons";
import { apiClient } from "../../lib/api/apiClient";
import { ProductInfo, StringedProductInfo } from "../../lib/types";
import { useContent } from "../../lib/hooks/useContent";
import { useIsMobile } from "../../lib/hooks/useIsMobile";

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

const handleEdit = (editedValues: StringedProductInfo) => {
  const editData = {
    name: editedValues.name,
    dimensions: editedValues.dimensions,
    stock: Number(editedValues.stock),
    variant: editedValues.variant,
    itemsPerPackage: Number(editedValues.itemsPerPackage),
    volumePerPackage: Number(editedValues.volumePerPackage),
  };
  console.log(editData);
  apiClient.products.updateProduct(editedValues.id, editData);
  window.location.reload();
};

interface StorageRowProps {
  product: ProductInfo;
}

export const StorageRow = ({ product }: StorageRowProps) => {
  const { t } = useContent();
  const isMobile = useIsMobile();
  const [editedValues, setEditedValues] = useState({
    ...product,
    stock: String(product.stock),
    itemsPerPackage: String(product.itemsPerPackage),
    volumePerPackage: String(product.volumePerPackage),
  });
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
            mt="5px"
            as="span"
            bg={commodityColor(product.name)}
            color="white"
            p="3px 6px"
            borderRadius="6px"
            textAlign="center"
          >
            {product.name}
          </Text>
          <Text display={isMobile ? "block" : "none"} mt="5px">
            {product.dimensions}
          </Text>
        </Td>
        {!isMobile && <Td>{product.dimensions}</Td>}
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
              display={showOptions ? "none" : "block"}
              w="28px"
              h="28px"
              color={commodityColor(product.name)}
            ></EditIcon>
            <CloseIcon
              display={showOptions ? "block" : "none"}
              w="23px"
              h="23px"
              color="red"
            ></CloseIcon>
          </Button>

          <Button
            display={showOptions ? "inline-block" : "none"}
            variant="outline"
            colorScheme="blue"
            height="30px"
            width="100px"
            fontSize="13px"
            onClick={onEditOpen}
          >
            Modyfikuj
          </Button>
          <Button
            display={showOptions ? "inline-block" : "none"}
            variant="outline"
            colorScheme="red"
            height="30px"
            width="100px"
            fontSize="13px"
            onClick={onDeletingOpen}
          >
            Usuń
          </Button>
        </Td>
      </Tr>
      <Modal
        isOpen={isEditOpen}
        onClose={() => {
          onEditClose(),
            setEditedValues({
              ...product,
              stock: String(product.stock),
              itemsPerPackage: String(product.itemsPerPackage),
              volumePerPackage: String(product.volumePerPackage),
            });
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modyfikowanie towaru</ModalHeader>
          <ModalCloseButton />
          <ModalBody className={styles["modal-inputs"]}>
            <label>{t("pages.storage.table.headings.name")}</label>
            <Input
              value={String(editedValues.name)}
              onChange={(event) =>
                setEditedValues({ ...editedValues, name: event.target.value })
              }
            />
            <label>{t("pages.storage.table.headings.dimensions")}</label>
            <Input
              value={String(editedValues.dimensions)}
              onChange={(event) =>
                setEditedValues({
                  ...editedValues,
                  dimensions: event.target.value,
                })
              }
            />
            <label>{t("pages.storage.table.headings.variant")}</label>
            <Select
              onChange={(e) =>
                setEditedValues({
                  ...editedValues,
                  variant: e.target.value,
                })
              }
            >
              <option
                value="white_wet"
                selected={editedValues.variant == "white_wet"}
              >
                {t("pages.storage.variants.white_wet")}
              </option>
              <option
                value="white_dry"
                selected={editedValues.variant == "dry"}
              >
                {t("pages.storage.variants.white_dry")}
              </option>
              <option value="black" selected={editedValues.variant == "black"}>
                {t("pages.storage.variants.black")}
              </option>
            </Select>
            <label>{t("pages.storage.table.headings.itemsPerPackage")}</label>
            <Input
              type="number"
              value={editedValues.itemsPerPackage}
              onChange={(event) =>
                setEditedValues({
                  ...editedValues,
                  itemsPerPackage: event.target.value,
                })
              }
            />
            <label>{t("pages.storage.table.headings.volumePerPackage")}</label>
            <Input
              value={editedValues.volumePerPackage}
              onChange={(event) =>
                setEditedValues({
                  ...editedValues,
                  volumePerPackage: event.target.value,
                })
              }
            />
            <label>{t("pages.storage.table.headings.stock")}</label>
            <Input
              type="number"
              value={editedValues.stock}
              onChange={(event) =>
                setEditedValues({
                  ...editedValues,
                  stock: event.target.value,
                })
              }
            />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={() => handleEdit(editedValues)}
              mr={3}
            >
              Modyfikuj
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                onEditClose(),
                  setEditedValues({
                    ...product,
                    stock: String(product.stock),
                    itemsPerPackage: String(product.itemsPerPackage),
                    volumePerPackage: String(product.volumePerPackage),
                  });
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
