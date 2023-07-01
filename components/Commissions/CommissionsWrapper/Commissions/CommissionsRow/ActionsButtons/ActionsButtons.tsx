import React, { useRef, useState } from "react";
import { Box, Button, Flex, WrapItem } from "@chakra-ui/react";
import { useOnClickOutside } from "../../../../../../lib/hooks/useOnClickOutside";
import { useContent } from "../../../../../../lib/hooks/useContent";
import { useIsMobile } from "../../../../../../lib/hooks/useIsMobile";

export const ActionsButtons = () => {
  const { t } = useContent();

  const isMobile = useIsMobile();

  const ref = useRef<HTMLDivElement | null>(null);

  useOnClickOutside(ref, () => setShowDropdown(false));

  const [showDropdown, setShowDropdown] = useState(false);

  const toggleShowDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  if (isMobile) {
    return (
      <Box position="relative" ref={ref}>
        <Button aria-label="more button" onClick={toggleShowDropdown}>
          ...
        </Button>
        <Box
          bg="white"
          p="10px 3px"
          borderRadius="5px"
          position="absolute"
          top="40px"
          right="0"
          boxShadow="6px 6px 6px -7px rgba(66, 68, 90, 1)"
          display={showDropdown ? "block" : "none"}
          zIndex="10"
        >
          <Flex w="100%" gap="10px" flexDir="column" p="5px">
            <WrapItem w="100%">
              <Button colorScheme="blue" variant="outline">
                Zrealizuj częściowo
              </Button>
            </WrapItem>
            <WrapItem w="100%">
              <Button colorScheme="blue" w="100%">
                Zrealizuj
              </Button>
            </WrapItem>
          </Flex>
        </Box>
      </Box>
    );
  } else {
    return (
      <>
        <Button colorScheme="blue" variant="outline">
          Zrealizuj częściowo
        </Button>
        <Button colorScheme="blue">Zrealizuj </Button>
      </>
    );
  }
};
