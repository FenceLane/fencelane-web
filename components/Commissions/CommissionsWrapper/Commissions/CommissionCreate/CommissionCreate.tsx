import React, { useEffect, useState } from "react";
import { ProductInfo } from "../../../../../lib/types";
import Link from "next/link";

import {
  Text,
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  Select,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useContent } from "../../../../../lib/hooks/useContent";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import { mapAxiosErrorToLabel } from "../../../../../lib/server/BackendError/BackendError";
import { usePostCommission } from "../../../../../lib/api/hooks/commissions";

interface CommissionCreateProps {
  products: ProductInfo[];
}

const initialNewProductsData = {
  productId: "",
  quantity: "",
};

export const CommissionCreate = ({ products }: CommissionCreateProps) => {
  const router = useRouter();
  const { t } = useContent();
  const [newProducts, setNewProducts] = useState([initialNewProductsData]);

  const {
    mutate: postCommission,
    error,
    isSuccess,
    isError,
    isLoading,
  } = usePostCommission();

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const productId = String(
      e.target.options[e.target.options.selectedIndex].getAttribute("data-key")
    );
    const index = Number(e.target.getAttribute("data-index"));
    const newArr = [...newProducts];
    newArr[index] = {
      productId: productId,
      quantity: newProducts[index].quantity,
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

  const handlePostCommission = () => {
    const numberedProducts = newProducts.map((product) => ({
      productId: product.productId,
      quantity: Number(product.quantity),
    }));
    postCommission({
      products: numberedProducts,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      router.push("/commissions");
    }
  }, [router, isSuccess]);

  return (
    <Flex width="100%" maxWidth="980px" flexDir="column">
      <Text color="var(--dark)" fontSize="20px" fontWeight="500" m="10px">
        {t("pages.commissions.commission-creator")}
      </Text>
      {newProducts.map((item, index) => (
        <span key={`${item.productId}_${index}`}>
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
            defaultValue={newProducts[index].productId}
          >
            {products &&
              products
                .sort((a, b) => {
                  if (a.category.name < b.category.name) {
                    return -1;
                  }
                  if (a.category.name > b.category.name) {
                    return 1;
                  }
                  if (a.dimensions < b.dimensions) {
                    return -1;
                  }
                  if (a.dimensions > b.dimensions) {
                    return 1;
                  }
                  if (a.variant > b.variant) {
                    return -1;
                  } else {
                    return 1;
                  }
                })
                .map((product) => (
                  <option
                    data-key={product.id}
                    key={product.id}
                    value={product.id}
                  >
                    {`${product.category.name}  ${product.dimensions} [${t(
                      `pages.storage.variants.${product.variant}`
                    ).toLowerCase()}]`}
                  </option>
                ))}
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
        </span>
      ))}
      <Flex gap="30px" justifyContent="space-between">
        <Box>
          <Button
            colorScheme="green"
            isLoading={isLoading}
            onClick={handlePostCommission}
            mr="20px"
          >
            {t("buttons.confirm")}
          </Button>
          <Link href="/commissions">
            <Button colorScheme="red">{t("buttons.cancel")}</Button>
          </Link>
        </Box>
        <IconButton
          aria-label="add product"
          icon={<AddIcon />}
          colorScheme="blue"
          onClick={handleAddProduct}
        ></IconButton>
      </Flex>
      {isError && (
        <Text color="red" fontWeight="600" fontSize="18px">
          {t(`errors.backendErrorLabel.${mapAxiosErrorToLabel(error)}`)}
        </Text>
      )}
    </Flex>
  );
};
