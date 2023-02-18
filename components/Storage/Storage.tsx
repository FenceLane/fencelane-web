import React, { useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
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
import { ProductInfo } from "../../lib/types";

interface CSTypes {
  id: React.Key;
  name: String;
  dimensions: String;
  volumePerPackage: Number;
  black: Number;
  white: Number;
  itemsPerPackage: Number;
  pieces: Number;
  stock: Number;
}

const handlePost = (data: any) => {
  const postData = {
    name: data.name,
    dimensions: data.dimensions,
    products: [
      {
        stock: data.stock,
        variant: data.variant_white ? "white_wet" : "black",
        itemsPerPackage: data.itemsPerPackage,
        volumePerPackage: data.volumePerPackage,
      },
    ],
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
  const emptyValues = {
    id: null,
    name: "",
    dimensions: "",
    volumePerPackage: 0,
    variant_white: true,
    itemsPerPackage: 0,
    pieces: 0,
    stock: 0,
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
              <Th>{t("pages.storage.table.headings.name")}</Th>
              <Th>{t("pages.storage.table.headings.dimensions")}</Th>
              <Th>{t("pages.storage.table.headings.volumePerPackage")}</Th>
              <Th>{t("pages.storage.table.headings.black")}</Th>
              <Th>{t("pages.storage.table.headings.white")}</Th>
              <Th>{t("pages.storage.table.headings.itemsPerPackage")}</Th>
              <Th>{t("pages.storage.table.headings.pieces")}</Th>
              <Th>{t("pages.storage.table.headings.stock")}</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {products.map((product: any) => (
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
              placeholder="Nazwa towaru"
              value={String(addedValues.name)}
              onChange={(event) =>
                setAddedValues({ ...addedValues, name: event.target.value })
              }
            />
            <Input
              placeholder="Wymiary"
              value={String(addedValues.dimensions)}
              onChange={(event) =>
                setAddedValues({
                  ...addedValues,
                  dimensions: event.target.value,
                })
              }
            />
            <Input
              placeholder="Ilość w M3"
              value={String(addedValues.volumePerPackage)}
              onChange={(event) =>
                setAddedValues({
                  ...addedValues,
                  volumePerPackage: !Number.isNaN(Number(event.target.value))
                    ? Number(event.target.value)
                    : 0,
                })
              }
            />
            <Select
              placeholder="Rodzaj"
              onChange={(e) =>
                setAddedValues({
                  ...addedValues,
                  variant_white: e.target.value === "white_wet" ? true : false,
                })
              }
            >
              <option value="white_wet" selected={addedValues.variant_white}>
                Biały mokry
              </option>
              <option value="black" selected={!addedValues.variant_white}>
                Czarny
              </option>
            </Select>
            <Input
              placeholder="Pakowanie"
              value={String(addedValues.itemsPerPackage)}
              onChange={(event) =>
                setAddedValues({
                  ...addedValues,
                  itemsPerPackage: !Number.isNaN(Number(event.target.value))
                    ? Number(event.target.value)
                    : 0,
                })
              }
            />
            <Input
              placeholder="Ilość pakietów"
              value={String(addedValues.stock)}
              onChange={(event) =>
                setAddedValues({
                  ...addedValues,
                  stock: !Number.isNaN(Number(event.target.value))
                    ? Number(event.target.value)
                    : 0,
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
