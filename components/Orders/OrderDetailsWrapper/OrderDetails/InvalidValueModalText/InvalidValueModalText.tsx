import { useContent } from "../../../../../lib/hooks/useContent";
import React from "react";
import { Text } from "@chakra-ui/react";
import { OrderInfo, QUANTITY_TYPE } from "../../../../../lib/types";

interface InvalidValueModalTextProps {
  specType: QUANTITY_TYPE;
  newProductDetails: {
    productOrderId: string;
    quantity: number;
    price: number;
  }[];
  orderData: OrderInfo;
}

export const InvalidValueModalText = ({
  specType,
  newProductDetails,
  orderData,
}: InvalidValueModalTextProps) => {
  const { t } = useContent();
  const calculatedNewProductDetails = newProductDetails.map((product, key) => {
    switch (specType) {
      case QUANTITY_TYPE.PIECES:
        return {
          productOrderId: product.productOrderId,
          quantity:
            product.quantity / orderData.products[key].product.itemsPerPackage,
          price: String(
            (Number(product.price) *
              orderData.products[key].product.itemsPerPackage) /
              Number(orderData.products[key].product.volumePerPackage)
          ),
        };
      case QUANTITY_TYPE.PACKAGES:
        return {
          productOrderId: product.productOrderId,
          quantity: product.quantity,
          price: String(
            Number(product.price) /
              Number(orderData.products[key].product.volumePerPackage)
          ),
        };
      case QUANTITY_TYPE.M3:
        return {
          productOrderId: product.productOrderId,
          quantity:
            product.quantity /
            Number(orderData.products[key].product.volumePerPackage),
          price: String(product.price),
        };
    }
  }); // zamiana ilosci na paczki i cen na za metr

  return (
    <>
      <Text>{t("pages.orders.order.bad-quantity.entered")}:</Text>
      {calculatedNewProductDetails.map(
        (product, key) =>
          product.quantity !== Math.floor(product.quantity) &&
          (specType === QUANTITY_TYPE.PACKAGES ? (
            <span key={key}>
              <Text fontWeight="500">{`
                  ${t("pages.orders.order.bad-quantity.for")}: ${
                orderData.products[key].product.category.name
              } ${orderData.products[key].product.dimensions}`}</Text>
              <Text>
                {`${product.quantity.toFixed(2)} ${t(
                  "pages.orders.order.bad-quantity.packages"
                )}. \n${t(
                  "pages.orders.order.bad-quantity.did-you-mean"
                )} ${Math.floor(product.quantity)} ${t(
                  "pages.orders.order.bad-quantity.packages"
                )}? `}
              </Text>
            </span>
          ) : (
            <span key={key}>
              <Text fontWeight="500">{`${t(
                "pages.orders.order.bad-quantity.for"
              )}: ${orderData.products[key].product.category.name} ${
                orderData.products[key].product.dimensions
              }`}</Text>
              <Text>
                {`${newProductDetails[key].quantity} ${t(
                  `pages.orders.order.bad-quantity.${specType}`
                )} ${t(
                  "pages.orders.order.bad-quantity.which-stands-for"
                )} ${product.quantity.toFixed(2)} ${t(
                  "pages.orders.order.bad-quantity.packages"
                )}. ${t(
                  "pages.orders.order.bad-quantity.did-you-mean"
                )} ${Math.floor(product.quantity)} ${t(
                  "pages.orders.order.bad-quantity.packages"
                )}? `}
              </Text>
            </span>
          ))
      )}
    </>
  );
};
