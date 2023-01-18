import { Box, Button, Wrap, WrapItem, Image } from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { TriangleDownIcon } from "@chakra-ui/icons";
import { useOnClickOutside } from "../../lib/hooks/useOnClickOutside";
import { apiClient } from "../../lib/api/apiClient";
import { useContent } from "../../lib/hooks/useContent";
import { mapAxiosErrorToLabel } from "../../lib/server/BackendError/BackendError";
import { toastError, toastInfo } from "../../lib/util/toasts";
import { useRouter } from "next/router";
import Link from "next/link";

interface ProfileInfoTypes {
  name: string;
  variant?: "avatar" | "name";
}

export default function ProfileInfoDropdown({
  name,
  variant = "avatar",
}: ProfileInfoTypes) {
  const [showDropdown, setShowDropdown] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const { t } = useContent();

  useOnClickOutside(ref, () => setShowDropdown(false));

  const toggleShowDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleLogout = () => {
    apiClient.auth
      .deleteLogout()
      .then(() => toastInfo(t("success.logout")))
      .catch((error) => {
        toastError(
          t(`errors.backendErrorLabel.${mapAxiosErrorToLabel(error)}`)
        );
      })
      .finally(() => {
        router.push("/login");
      });
  };

  return (
    <>
      {variant === "name" ? (
        <Button
          mt="6px"
          bg="white"
          cursor="default"
          _hover={{
            background: "white",
          }}
          _active={{
            background: "white",
          }}
        >
          <Image src={"./images/avatar.svg"} alt="" />
        </Button>
      ) : (
        <></>
      )}
      <Box
        minW={70}
        className="userInfo"
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        position="relative"
        ref={ref}
      >
        {variant === "name" ? (
          <>
            <Button
              colorScheme="teal"
              variant="outline"
              h="32px"
              onClick={toggleShowDropdown}
              mr="20px"
            >
              {name}
              <TriangleDownIcon w="10px" ml="15px" />
            </Button>
          </>
        ) : (
          <Button onClick={toggleShowDropdown} bg="none" mt="5px">
            <Image src={"./images/avatar.svg"} alt="" />
          </Button>
        )}

        <Box
          bg="white"
          p="10px 15px 15px 15px "
          borderRadius="5px"
          position="absolute"
          top="45px"
          right={`${variant === "avatar" ? "calc(-50% - 10px)" : 15}`}
          className="profileDropdown"
          boxShadow="0px 6px 6px -7px rgba(66, 68, 90, 1)"
          display={showDropdown ? "block" : "none"}
          zIndex="10"
        >
          <Wrap spacing={4} w="100%">
            <WrapItem w="100%">
              <Button
                href="/profile"
                as={Link}
                colorScheme="teal"
                variant="outline"
                width="100%"
                h="32px"
              >
                {t("general.layout.header.dropdown.profile")}
              </Button>
            </WrapItem>
            <WrapItem w="100%">
              <Button
                onClick={handleLogout}
                colorScheme="teal"
                variant="outline"
                width="100%"
                h="32px"
              >
                {t("general.layout.header.dropdown.logout")}
              </Button>
            </WrapItem>
          </Wrap>
        </Box>
      </Box>
    </>
  );
}
