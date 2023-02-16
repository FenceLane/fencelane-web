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

export const Storage = (props: any) => {
  const commodityStock: CSTypes[] = props.commodityStock;
  const { t } = useContent();
  const [addedValues, setAddedValues] = useState({
    id: null,
    name: "",
    dimensions: "",
    volumePerPackage: 0,
    black: 0,
    white: 0,
    itemsPerPackage: 0,
    pieces: 0,
    stock: 0,
  });

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
              <Th>{t("pages.storage.table.headings.commodity")}</Th>
              <Th>{t("pages.storage.table.headings.dimensions")}</Th>
              <Th>{t("pages.storage.table.headings.m3Quantity")}</Th>
              <Th>{t("pages.storage.table.headings.black")}</Th>
              <Th>{t("pages.storage.table.headings.white")}</Th>
              <Th>{t("pages.storage.table.headings.package")}</Th>
              <Th>{t("pages.storage.table.headings.piecesQuantity")}</Th>
              <Th>{t("pages.storage.table.headings.packagesQuantity")}</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {commodityStock.map((row: any) => (
              <StorageRow key={row.id} row={row}></StorageRow>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Modal isOpen={isAddingOpen} onClose={onAddingClose}>
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
                  volumePerPackage: Number(event.target.value),
                })
              }
            />
            <Select placeholder="Rodzaj">
              <option
                value="white_wet"
                selected={addedValues.white != 0 ? true : false}
              >
                Biały mokry
              </option>
              <option
                value="czarny"
                selected={addedValues.black != 0 ? true : false}
              >
                Czarny
              </option>
            </Select>
            <Input
              placeholder="Pakowanie"
              value={String(addedValues.itemsPerPackage)}
              onChange={(event) =>
                setAddedValues({
                  ...addedValues,
                  itemsPerPackage: Number(event.target.value),
                })
              }
            />
            <Input
              placeholder="Ilość pakietów"
              value={String(addedValues.stock)}
              onChange={(event) =>
                setAddedValues({
                  ...addedValues,
                  stock: Number(event.target.value),
                })
              }
            />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="green"
              onClick={() => console.log(addedValues)}
              mr={3}
            >
              Dodaj
            </Button>
            <Button colorScheme="red" onClick={onAddingClose}>
              Anuluj
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
