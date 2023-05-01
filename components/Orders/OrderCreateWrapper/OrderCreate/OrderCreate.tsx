import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Text,
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  Select,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { usePostOrder } from "../../../../lib/api/hooks/orders";
import { useContent } from "../../../../lib/hooks/useContent";
import { mapAxiosErrorToLabel } from "../../../../lib/server/BackendError/BackendError";
import { useGetEurRate } from "../../../../lib/api/hooks/calcs";

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
  const {
    isError: isRateError,
    error: rateError,
    isLoading: isRateLoading,
    data: rate,
  } = useGetEurRate();
  const router = useRouter();
  const { t } = useContent();
  const [newProducts, setNewProducts] = useState([initialNewProductsData]);

  const [orderData, setOrderData] = useState(initialOrderData);

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
      currency: "EUR",
      price: Number(product.price),
    }));
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
        {t("pages.orders.order-creator.order-creator")}
      </Text>
      <label>{t("main.client")}</label>
      <Select
        required
        bg="white"
        placeholder={t("main.client")}
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
      <label>{t("main.destination")}</label>
      <Select
        required
        bg="white"
        placeholder={t("main.destination")}
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
            <label>
              {t("main.product")} {index + 1}
            </label>
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
            placeholder={t("main.product")}
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
          <label>{t("pages.orders.order-creator.packages-quantity")}</label>
          <Input
            required
            value={newProducts[index].quantity}
            name="quantity"
            bg="white"
            mb="20px"
            type="number"
            placeholder={t("main.quantity")}
            data-index={index}
            onChange={handleProductDetailsChange}
          />
          <label>{t("pages.orders.order-creator.price-per-m3")}</label>
          <Input
            value={newProducts[index].price}
            name="price"
            bg="white"
            mb="20px"
            type="number"
            placeholder={t("pages.orders.order-creator.price-per-m3")}
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
            {t("buttons.confirm")}
          </Button>
          <Button colorScheme="red">
            <Link href="/orders">{t("buttons.cancel")}</Link>
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
        <Text color="red" fontWeight="600" fontSize="18px">
          {t(`errors.backendErrorLabel.${mapAxiosErrorToLabel(error)}`)}
        </Text>
      )}
    </>
  );
};