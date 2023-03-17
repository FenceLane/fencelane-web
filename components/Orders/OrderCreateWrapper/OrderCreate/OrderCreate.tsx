import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Text,
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  Select,
  Alert,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { usePostOrder } from "../../../../lib/api/hooks/orders";
import { useContent } from "../../../../lib/hooks/useContent";
import { mapAxiosErrorToLabel } from "../../../../lib/server/BackendError/BackendError";

const initialOrderData = {
  clientId: "",
  destinationId: "",
};

const initialNewProductsData = {
  productId: "",
  quantity: "",
  price: "",
};

export const OrderCreate = ({ clients, destinations, products }: any) => {
  const router = useRouter();
  const { t } = useContent("errors.backendErrorLabel");
  const [newProducts, setNewProducts] = useState([initialNewProductsData]);

  const [orderData, setOrderData] = useState(initialOrderData);

  const [errorAlert, setErrorAlert] = useState(false);

  const {
    mutate: postOrder,
    error,
    isSuccess,
    isLoading,
  } = usePostOrder(() => console.log("success"));

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name } = e.target;
    setOrderData((orderData) => ({
      ...orderData,
      [name]:
        e.target.options[e.target.options.selectedIndex].getAttribute(
          "data-key"
        ),
    }));
  };

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const productId = String(
      e.target.options[e.target.options.selectedIndex].getAttribute("data-key")
    );
    const index = Number(e.target.getAttribute("data-index"));
    const newArr = [...newProducts];
    newArr[index] = {
      productId: productId,
      quantity: newProducts[index].quantity,
      price: newProducts[index].price,
    };
    setNewProducts(newArr);
  };

  const handleProductDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const index = Number(e.target.getAttribute("data-index"));
    const name = e.target.name;
    const newArr = [...newProducts];
    newArr[index] = {
      ...newProducts[index],
      [name]: e.target.value,
    };
    setNewProducts(newArr);
  };

  const handleAddProduct = () => {
    setNewProducts([...newProducts, initialNewProductsData]);
  };

  const handleDeleteProduct = (globalIndex: number) => {
    newProducts.length > 1 &&
      setNewProducts(
        newProducts.filter((item, index) => index !== globalIndex)
      );
  };

  const handlePostOrder = () => {
    const numberedProducts = newProducts.map((product) => ({
      productId: product.productId,
      quantity: Number(product.quantity),
      price: Number(product.price),
    }));
    console.log();
    console.log({
      clientId: orderData.clientId,
      destinationId: orderData.destinationId,
      products: numberedProducts,
    });
    postOrder({
      clientId: orderData.clientId,
      destinationId: orderData.destinationId,
      products: numberedProducts,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      router.push("/orders");
    }
  }, [router, isSuccess]);

  return (
    <>
      <Text color="var(--dark)" fontSize="20px" fontWeight="500" m="10px">
        Kreator zamówienia
      </Text>
      <label>Klient</label>
      <Select
        required
        bg="white"
        placeholder="Klient"
        mb="20px"
        name="clientId"
        onChange={handleChange}
      >
        {clients.data.map((client: any) => (
          <option data-key={client.id} key={client.id}>
            {client.name}
          </option>
        ))}
      </Select>
      <label>Destynacja</label>
      <Select
        required
        bg="white"
        placeholder="Destynacja"
        mb="20px"
        name="destinationId"
        onChange={handleChange}
      >
        {destinations.data.map((destination: any) => (
          <option data-key={destination.id} key={destination.id}>
            {`${destination.address}, ${destination.postalCode} ${destination.city}`}
          </option>
        ))}
      </Select>
      {newProducts.map((item, index) => (
        <>
          <Flex justifyContent="space-between" alignItems="center">
            <label>Produkt {index + 1}</label>
            <IconButton
              colorScheme="red"
              aria-label="delete product"
              icon={<CloseIcon />}
              onClick={() => handleDeleteProduct(index)}
            />
          </Flex>
          <Select
            required
            bg="white"
            mb="20px"
            placeholder="Produkt"
            data-index={index}
            onChange={handleProductChange}
          >
            {products &&
              products.map(
                (product: {
                  id: string | null | undefined;
                  category: {
                    name: string;
                  };
                  dimensions: string;
                }) => (
                  <option
                    data-key={product.id}
                    key={product.id}
                    selected={product.id === newProducts[index].productId}
                  >
                    {product.category.name + " " + product.dimensions}
                  </option>
                )
              )}
          </Select>
          <label>Ilość pakietów</label>
          <Input
            required
            value={newProducts[index].quantity}
            name="quantity"
            bg="white"
            mb="20px"
            type="number"
            placeholder="Ilość"
            data-index={index}
            onChange={handleProductDetailsChange}
          />
          <label>Cena</label>
          <Input
            value={newProducts[index].price}
            name="price"
            bg="white"
            mb="20px"
            type="number"
            placeholder="Cena"
            data-index={index}
            onChange={handleProductDetailsChange}
          />
        </>
      ))}
      <Flex gap="30px" justifyContent="space-between">
        <Box>
          <Button
            colorScheme="green"
            isLoading={isLoading}
            onClick={handlePostOrder}
            mr="20px"
          >
            Zatwierdź
          </Button>
          <Button colorScheme="red">
            <Link href="/orders">Anuluj</Link>
          </Button>
        </Box>
        <IconButton
          aria-label="add product"
          icon={<AddIcon />}
          colorScheme="blue"
          onClick={handleAddProduct}
        ></IconButton>
      </Flex>
      {error && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>{t(mapAxiosErrorToLabel(error))}</AlertTitle>
        </Alert>
      )}
    </>
  );
};
