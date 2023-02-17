import React, { useRef, useState } from "react";
import {
  Text,
  Tr,
  Td,
  Button,
  Flex,
  Box,
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
import { EditIcon } from "@chakra-ui/icons";

const commodityColor = (commodity: String) => {
  if (commodity === "Palisada okorowana") return "#805AD5";
  if (commodity === "Palisada cylindryczna") return "#D53F8C";
  if (commodity === "Palisada nieokorowana") return "#DBC234";
  if (commodity === "Palisada prostokątna") return "#38A169";
  if (commodity === "Słupek bramowy") return "#EF7F18";
};
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

export const StorageRow = (props: any) => {
  const row: CSTypes = props.row;
  const [editedValues, setEditedValues] = useState(row);
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
      <Tr className={styles["commodity-table-row"]} key={row.id}>
        <Td>
          <Text
            as="span"
            bg={commodityColor(row.name)}
            color="white"
            p="3px 6px"
            borderRadius="6px"
            textAlign="center"
          >
            {row.name}
          </Text>
        </Td>
        <Td>{row.dimensions}</Td>
        <Td>{String(row.volumePerPackage)}</Td>
        <Td>{String(row.black)}</Td>
        <Td>{String(row.white)}</Td>
        <Td>{String(row.itemsPerPackage)}</Td>
        <Td>{String(row.pieces)}</Td>
        <Td>{String(row.stock)}</Td>
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
              color={commodityColor(row.name)}
            ></EditIcon>
          </Button>
        </Td>
        <Box
          display={showOptions ? "block" : "none"}
          position="absolute"
          top="0"
          right="70px"
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
        </Box>
      </Tr>

      <Modal
        isOpen={isEditOpen}
        onClose={() => {
          onEditClose(), setEditedValues(row);
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
              value={String(editedValues.volumePerPackage)}
              onChange={(event) =>
                setEditedValues({
                  ...editedValues,
                  volumePerPackage: !Number.isNaN(Number(event.target.value))
                    ? Number(event.target.value)
                    : 0,
                })
              }
            />
            <Select placeholder="Rodzaj">
              <option
                value="white_wet"
                selected={editedValues.white != 0 ? true : false}
              >
                Biały mokry
              </option>
              <option
                value="czarny"
                selected={editedValues.black != 0 ? true : false}
              >
                Czarny
              </option>
            </Select>
            <Input
              placeholder="Pakowanie"
              value={String(editedValues.itemsPerPackage)}
              onChange={(event) =>
                setEditedValues({
                  ...editedValues,
                  itemsPerPackage: !Number.isNaN(Number(event.target.value))
                    ? Number(event.target.value)
                    : 0,
                })
              }
            />
            <Input
              placeholder="Ilość pakietów"
              value={String(editedValues.stock)}
              onChange={(event) =>
                setEditedValues({
                  ...editedValues,
                  stock: !Number.isNaN(Number(event.target.value))
                    ? Number(event.target.value)
                    : 0,
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
                onEditClose(), setEditedValues(row);
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
              onClick={() => console.log("delete")}
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
