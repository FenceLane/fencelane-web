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
  return (
    <>
      <Tbody borderBottom="5px solid var(--light-content)">
        <Tr>
          <Td fontWeight={500} rowSpan={orderData[1].length + 1}>
            {orderData[0]}
          </Td>
        </Tr>
        {orderData[1].map((parent, index) => (
          <Tr key={index}>
            <Td borderBottom="none">
              <ChakraLink
                as={Link}
                href={`/loads/${parent.products[0].orderId}`}
              >
                {parent.products[0].orderId}
              </ChakraLink>
            </Td>

            <Td>
              {`${parent.products[0].product.category.name}
               ${parent.products[0].product.dimensions} [${t(
                `pages.storage.variants.${parent.products[0].product.variant}`
              )}]`}
            </Td>
            <Td>{parent.products[0].quantity} p.</Td>
          </Tr>
        ))}
      </Tbody>
    </>
  );
};
