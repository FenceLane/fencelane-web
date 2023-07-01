import { Box, Stack, Text } from "@chakra-ui/react";
import React from "react";

interface ProductTypesProps {
  title: string;
  percentage: number;
  color: string;
}

const ProductTypes = ({ title, percentage, color }: ProductTypesProps) => {
  return (
    <Box width={"100%"} borderRadius={"15px"} mt={3}>
      <Stack
        direction={"row"}
        alignItems="center"
        justifyContent="space-between"
      >
        <Text fontSize={18} fontWeight="500" color={"blackAlpha.700"}>
          {title}
        </Text>
        <Text fontSize={18} fontWeight="500" color={"blackAlpha.700"}>
          {percentage}%
        </Text>
      </Stack>
      <Box
        mt={2}
        position="relative"
        width="100%"
        height="8px"
        borderRadius={"10px"}
        bgColor="#e4e8ef"
      >
        <Box
          width={`${percentage}%`}
          bgColor={color}
          height={"100%"}
          borderRadius="10px"
        />
      </Box>
    </Box>
  );
};

export default ProductTypes;
