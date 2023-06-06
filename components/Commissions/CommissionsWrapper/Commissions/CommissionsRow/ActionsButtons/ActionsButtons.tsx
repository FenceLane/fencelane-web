import React, { useRef, useState } from "react";
import { Box, Button, Flex, IconButton, WrapItem } from "@chakra-ui/react";
import { useOnClickOutside } from "../../../../../../lib/hooks/useOnClickOutside";
import { CalendarIcon, CheckIcon, TriangleDownIcon } from "@chakra-ui/icons";
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
          <Flex w="100%" gap="10px" flexDir="column">
            <WrapItem w="100%">
              <IconButton aria-label="more button" icon={<CheckIcon />} />
            </WrapItem>
            <WrapItem w="100%">
              <IconButton
                aria-label="more button"
                icon={<TriangleDownIcon />}
              />
            </WrapItem>
            <WrapItem w="100%">
              <IconButton aria-label="more button" icon={<CalendarIcon />} />
            </WrapItem>
          </Flex>
        </Box>{" "}
      </Box>
    );
  } else {
    return (
      <>
        <IconButton aria-label="more button" icon={<CheckIcon />} />
        <IconButton aria-label="more button" icon={<TriangleDownIcon />} />
        <IconButton aria-label="more button" icon={<CalendarIcon />} />
      </>
    );
  }
};
