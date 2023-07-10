import { Tbody, Td, Tr, Link as ChakraLink } from "@chakra-ui/react";
import React from "react";
import { OrderInfo } from "../../../lib/types";
import { useContent } from "../../../lib/hooks/useContent";
import Link from "next/link";

interface ParentOrdersRowProps {
  orderData: [string, OrderInfo[]];
}

export const ParentOrdersRow = ({ orderData }: ParentOrdersRowProps) => {
  const { t } = useContent();
  console.log(orderData[0]);
  console.log(orderData[1]);
  if (
    orderData[1].reduce((acc, parent) => (acc += parent.products.length), 0) ===
    1
  ) {
    return (
      <Tbody borderBottom="5px solid var(--light-content)">
        <Tr bg="white">
          <Td
            bg="white"
            fontWeight={500}
            rowSpan={
              orderData[1].reduce(
                (acc, parent) => (acc += parent.products.length),
                0
              ) +
              orderData[1].length +
              1
            }
          >
            {orderData[0]}
            <br />
            {orderData[1][0].destination.client.name}
            <br />
            {orderData[1][0].destination.city}
          </Td>
          {orderData[1].map((parent, index) => (
            <>
              <Td rowSpan={parent.products.length + 1} bg="white">
                <ChakraLink
                  as={Link}
                  href={`/loads/${parent.products[0].orderId}`}
                >
                  {parent.products[0].orderId}
                </ChakraLink>
              </Td>
              {parent.products.map((product, index) => (
                <>
                  <Td bg="white">
                    {`${product.product.category.name}
         ${product.product.dimensions} [${t(
                      `pages.storage.variants.${product.product.variant}`
                    )}]`}
                  </Td>
                  <Td bg="white">{product.quantity} p.</Td>
                </>
              ))}
            </>
          ))}
        </Tr>
      </Tbody>
    );
  }

  return (
    <Tbody borderBottom="5px solid var(--light-content)">
      <Tr bg="white">
        <Td
          bg="white"
          fontWeight={500}
          rowSpan={
            orderData[1].reduce(
              (acc, parent) => (acc += parent.products.length),
              0
            ) +
            orderData[1].length +
            1
          }
        >
          {orderData[0]}
          <br />
          {orderData[1][0].destination.client.name}
          <br />
          {orderData[1][0].destination.city}
        </Td>
      </Tr>
      {orderData[1].map((parent, index) => (
        <>
          <Tr bg="white" key={index}>
            <Td rowSpan={parent.products.length + 1} bg="white">
              <ChakraLink
                as={Link}
                href={`/loads/${parent.products[0].orderId}`}
              >
                {parent.products[0].orderId}
              </ChakraLink>
            </Td>
          </Tr>
          {parent.products.map((product, index) => (
            <Tr
              bg="white"
              key={index}
              borderBottom={
                index === parent.products.length - 1
                  ? "2px solid #DDD"
                  : "1px solid gray"
              }
            >
              <Td bg="white">
                {`${product.product.category.name}
               ${product.product.dimensions} [${t(
                  `pages.storage.variants.${product.product.variant}`
                )}]`}
              </Td>
              <Td bg="white">{product.quantity} p.</Td>
            </Tr>
          ))}
        </>
      ))}
    </Tbody>
  );
};
