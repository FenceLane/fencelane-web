import {
  Modal,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  ModalFooter,
  Select,
  Flex,
  useDisclosure,
  Input,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useContent } from "../../../lib/hooks/useContent";
import styles from "./OrderAddModal.module.scss";
import {
  useGetClients,
  useGetDestinations,
  usePostOrder,
} from "../../../lib/api/hooks/orders";
import { useGetProducts } from "../../../lib/api/hooks/products";
import { LoadingAnimation } from "../../LoadingAnimation/LoadingAnimation";

const initialOrderState = {
  clientId: "",
  destinationId: "",
  products: [{}],
};

interface OrderAddModalProps {
  onAddClose: Function;
  onAddOpen: Function;
  isAddOpen: boolean;
}

export const OrderAddModal = ({
  onAddClose,
  onAddOpen,
  isAddOpen,
}: OrderAddModalProps) => {
  const { t } = useContent();

  const [orderData, setOrderData] = useState(initialOrderState);

  const [currentProduct, setCurrentProduct] = useState({ id: "", quantity: 0 });

  const {
    isError: isClientsError,
    error: clientsError,
    isLoading: isClientsLoading,
    data: clients,
  } = useGetClients();

  const {
    isError: isDestinationsError,
    error: destinationsError,
    isLoading: isDestinationsLoading,
    data: destinations,
  } = useGetDestinations();

  const {
    isError: isProductsError,
    error: productsError,
    isLoading: isProductsLoading,
    data: products,
  } = useGetProducts();

  const handleModalClose = () => {
    onAddClose();
  };

  const {
    mutate: postOrder,
    error,
    isSuccess,
    isLoading,
  } = usePostOrder(handleModalClose);

  const {
    isOpen: isProductChooseOpen,
    onOpen: onProductChooseOpen,
    onClose: onProductChooseClose,
  } = useDisclosure();

  const handlePostOrder = () => {
    const {} = orderData;

    postOrder({});
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name } = event.target;
    setOrderData((orderData) => ({
      ...orderData,
      [name]:
        event.target.options[event.target.options.selectedIndex].getAttribute(
          "data-key"
        ),
    }));
  };

  const handleChooseProductsOpen = () => {
    onProductChooseOpen();
    handleModalClose();
  };

  const handleChooseProductsClose = () => {
    onProductChooseClose();
  };

  const handleProductChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = String(
      event.target.options[event.target.options.selectedIndex].getAttribute(
        "data-key"
      )
    );
    setCurrentProduct({ ...currentProduct, id: newId });
    console.log(currentProduct);
  };

  const handleProductQuantityChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newQuantity = event.target.value;
    setCurrentProduct({ ...currentProduct, quantity: Number(newQuantity) });
    console.log(currentProduct);
  };

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const handleAddNextProduct = async () => {
    setOrderData((orderData) => ({
      ...orderData,
      products: [...orderData.products, currentProduct],
    }));
    onProductChooseClose();
    await delay(200);
    onProductChooseOpen();
    console.log(orderData);
  };

  if (isClientsLoading || isDestinationsLoading || isProductsLoading)
    return (
      <Flex justifyContent="center" alignItems="center" height="100%">
        <LoadingAnimation></LoadingAnimation>
      </Flex>
    );

  return (
    <>
      <Modal isOpen={isAddOpen} onClose={handleModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Dodawanie zamówienia</ModalHeader>
          <ModalCloseButton />
          <ModalBody className={styles["modal-inputs"]}>
            <label>Klient</label>
            <Select
              placeholder="Klient"
              mb="20px"
              onChange={handleChange}
              name="clientId"
            >
              {clients.data.map((client: any) => (
                <option data-key={client.id} key={client.id}>
                  {client.name}
                </option>
              ))}
            </Select>
            <label>Destynacja</label>
            <Select
              placeholder="Destynacja"
              onChange={handleChange}
              name="orderId"
            >
              {destinations.data.map((destination: any) => (
                <option data-key={destination.id} key={destination.id}>
                  {destination.address +
                    ", " +
                    destination.postalCode +
                    " " +
                    destination.city}
                </option>
              ))}
            </Select>
          </ModalBody>
          <ModalFooter alignItems="flex-end">
            <Button
              colorScheme="green"
              onClick={handleChooseProductsOpen}
              mr={3}
            >
              Wybierz produkty
            </Button>
            <Button colorScheme="red" onClick={handleModalClose}>
              {t("pages.storage.buttons.cancel")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isProductChooseOpen} onClose={handleChooseProductsClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Wybór produktów</ModalHeader>
          <ModalCloseButton />
          <ModalBody className={styles["modal-inputs"]}>
            <label>Produkt</label>
            <Select
              mb="20px"
              onChange={handleProductChange}
              placeholder="Produkt"
            >
              {products &&
                products.map((product) => (
                  <option data-key={product.id} key={product.id}>
                    {product.name + " " + product.dimensions}
                  </option>
                ))}
            </Select>
            <label>Ilość pakietów</label>
            <Input
              defaultValue=""
              type="number"
              placeholder="Ilość"
              onChange={handleProductQuantityChange}
            />
          </ModalBody>
          <ModalFooter alignItems="flex-end">
            <Button
              colorScheme="green"
              isLoading={isLoading}
              onClick={handlePostOrder}
              mr={3}
            >
              Zatwierdź
            </Button>
            <Button colorScheme="blue" mr={3} onClick={handleAddNextProduct}>
              Dodaj kolejny
            </Button>
            <Button colorScheme="red" onClick={handleChooseProductsClose}>
              {t("pages.storage.buttons.cancel")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
