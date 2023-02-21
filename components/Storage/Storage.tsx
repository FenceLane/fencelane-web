import React, { useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Text,
  TableContainer,
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
import { useContent } from "../../lib/hooks/useContent";
import styles from "./Storage.module.scss";
import { StorageRow } from "../StorageRow/StorageRow";
import { AddIcon } from "@chakra-ui/icons";
import { apiClient } from "../../lib/api/apiClient";
import {
  ShortProduct,
  ShortStringedProduct,
  ProductInfo,
} from "../../lib/types";
import { useIsMobile } from "../../lib/hooks/useIsMobile";

const handlePost = (data: ShortStringedProduct) => {
  const postData: ShortProduct = {
    name: data.name,
    dimensions: data.dimensions,
    variant: data.variant,
    itemsPerPackage: Number(data.itemsPerPackage),
    volumePerPackage: Number(data.volumePerPackage),
    stock: Number(data.stock),
  };
  console.log(postData);
  apiClient.products.postProduct(postData);
  window.location.reload();
};

interface StorageProps {
  products: ProductInfo[];
}

export const Storage = ({ products }: StorageProps) => {
  const { t } = useContent();
  const isMobile = useIsMobile();
  const emptyValues = {
    name: "",
    dimensions: "",
    variant: "white_wet",
    itemsPerPackage: "",
    volumePerPackage: "",
    stock: "",
  };
  const [addedValues, setAddedValues] = useState(emptyValues);

  const {
    isOpen: isAddingOpen,
    onOpen: onAddingOpen,
    onClose: onAddingClose,
  } = useDisclosure();

  return (
    <>
      <Button
        className={styles["add-button"]}
        rightIcon={<AddIcon />}
        colorScheme="teal"
        variant="solid"
        mb="20px"
        bg="var(--dark)"
        fontSize="15px"
        fontWeight={500}
        onClick={onAddingOpen}
      >
        Dodaj towar
      </Button>
      <TableContainer className={styles.container}>
        <Table
          variant="simple"
          colorScheme="teal"
          bg="white"
          className={styles["commodity-table"]}
        >
          <Thead className={styles["commodity-table-thead"]}>
            <Tr>
              <Th>
                <Text display="block">
                  {t("pages.storage.table.headings.name")}
                </Text>
                <Text display={isMobile ? "block" : "none"} mt="5px">
                  {t("pages.storage.table.headings.dimensions")}
                </Text>
              </Th>
              {!isMobile && (
                <Th>{t("pages.storage.table.headings.dimensions")}</Th>
              )}
              <Th>{t("pages.storage.table.headings.variant")}</Th>
              <Th>{t("pages.storage.table.headings.itemsPerPackage")}</Th>
              <Th>{t("pages.storage.table.headings.volumePerPackage")}</Th>
              <Th>{t("pages.storage.table.headings.pieces")}</Th>
              <Th>{t("pages.storage.table.headings.stock")}</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {products.map((product: ProductInfo) => (
              <StorageRow key={product.id} product={product}></StorageRow>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Modal
        isOpen={isAddingOpen}
        onClose={() => {
          onAddingClose(), setAddedValues(emptyValues);
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Dodaj towar</ModalHeader>
          <ModalCloseButton />
          <ModalBody className={styles["modal-inputs"]}>
            <Input
              placeholder={t("pages.storage.table.headings.name")}
              value={String(addedValues.name)}
              onChange={(event) =>
                setAddedValues({ ...addedValues, name: event.target.value })
              }
            />
            <Input
              placeholder={t("pages.storage.table.headings.dimensions")}
              value={String(addedValues.dimensions)}
              onChange={(event) =>
                setAddedValues({
                  ...addedValues,
                  dimensions: event.target.value,
                })
              }
            />
            <Select
              placeholder={t("pages.storage.table.headings.variant")}
              onChange={(e) =>
                setAddedValues({
                  ...addedValues,
                  variant: e.target.value,
                })
              }
            >
              <option value="white_wet">
                {t("pages.storage.variants.white_wet")}
              </option>
              <option value="white_dry">
                {t("pages.storage.variants.white_dry")}
              </option>
              <option value="black">{t("pages.storage.variants.black")}</option>
            </Select>
            <Input
              placeholder={t("pages.storage.table.headings.itemsPerPackage")}
              type="number"
              value={String(addedValues.itemsPerPackage)}
              onChange={(event) =>
                setAddedValues({
                  ...addedValues,
                  itemsPerPackage: event.target.value,
                })
              }
            />
            <Input
              placeholder={t("pages.storage.table.headings.volumePerPackage")}
              type="number"
              value={String(addedValues.volumePerPackage)}
              onChange={(event) =>
                setAddedValues({
                  ...addedValues,
                  volumePerPackage: event.target.value,
                })
              }
            />
            <Input
              placeholder={t("pages.storage.table.headings.stock")}
              type="number"
              value={String(addedValues.stock)}
              onChange={(event) =>
                setAddedValues({
                  ...addedValues,
                  stock: event.target.value,
                })
              }
            />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="green"
              onClick={() => handlePost(addedValues)}
              mr={3}
            >
              Dodaj
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                onAddingClose(), setAddedValues(emptyValues);
              }}
            >
              Anuluj
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
