import { Box, Button, Wrap, WrapItem } from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { TriangleDownIcon } from "@chakra-ui/icons";
import { useOnClickOutside } from "../../lib/util/hooks/useOnClickOutside";

export default function ProfileInfoDropdown() {
  const [showDropdown, setShowDropdown] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(ref, () => setShowDropdown(false));
  const toggleShowDropdown = () => {
    setShowDropdown((prev) => !prev);
  };
  return (
    <Box
      w={200}
      className="userInfo"
      display="flex"
      flexDirection="row"
      justifyContent="right"
      alignItems="center"
      mr="20px"
      position="relative"
      ref={ref}
    >
      <Button
        colorScheme="teal"
        variant="outline"
        h="32px"
        onClick={() => toggleShowDropdown()}
      >
        Szymon
        <TriangleDownIcon w="10px" ml="15px" />
      </Button>
      <Box
        bg="white"
        p="15px"
        borderRadius="5px"
        position="absolute"
        top="50px"
        right="0"
        className="profileDropdown"
        boxShadow="0px 6px 6px -7px rgba(66, 68, 90, 1)"
        display={showDropdown ? "block" : "none"}
      >
        <Wrap spacing={4} w="100%">
          <WrapItem w="100%">
            <Button colorScheme="teal" variant="outline" width="100%">
              Mój profil
            </Button>
          </WrapItem>
          <WrapItem w="100%">
            <Button colorScheme="teal" variant="outline" width="100%">
              Wyloguj się
            </Button>
          </WrapItem>
        </Wrap>
      </Box>
    </Box>
  );
}
