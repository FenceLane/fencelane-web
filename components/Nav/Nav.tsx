import { Box, Link, Image, Text } from "@chakra-ui/react";
import React from "react";
import { use100vh } from "react-div-100vh";
import styles from "./Nav.module.scss";
import NextLink from "next/link";
import { useContent } from "../../lib/hooks/useContent";

export interface NavProps {
  hideSidebar: boolean;
  isMenuActive: boolean;
  isMobile: boolean;
  menuItems: Array<menuItem>;
}
interface menuItem {
  name: string;
  icon: string;
}
export const Nav = ({
  hideSidebar,
  isMenuActive,
  isMobile,
  menuItems,
}: NavProps) => {
  const { t } = useContent("general");
  const height = use100vh();
  const actualHeight = height ? height - 50 : "calc(100vh - 50px)";
  return (
    <>
      {!hideSidebar && (isMenuActive || !isMobile) && (
        <Box className={styles.nav} height={actualHeight}>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="space-between"
            h="100%"
          >
            <Box>
              {menuItems.map((item) => (
                <Link
                  as={NextLink}
                  key={item.name}
                  href=""
                  _hover={{
                    textDecoration: "none",
                  }}
                >
                  <Box className={styles["nav-item"]}>
                    <Image
                      width="20px"
                      src={`./images/navicons/${item.icon}.svg`}
                      alt=""
                    />
                    <Text>{t(`layout.sidebar.menu.${item.name}.label`)}</Text>
                  </Box>
                </Link>
              ))}
            </Box>
            <Box>
              <Link
                as={NextLink}
                href=""
                _hover={{
                  textDecoration: "none",
                }}
              >
                <Box className={styles["nav-item"]}>
                  <Image
                    width="20px"
                    src={`./images/navicons/ustawienia.svg`}
                    alt=""
                  />
                  <Text
                    _hover={{
                      color: "white",
                    }}
                  >
                    {t(`layout.sidebar.menu.settings.label`)}
                  </Text>
                </Box>
              </Link>
              <Link
                as={NextLink}
                href=""
                _hover={{
                  textDecoration: "none",
                }}
              >
                <Box className={styles["nav-item"]}>
                  <Image
                    width="20px"
                    src={`./images/navicons/pomoc.svg`}
                    alt="pomoc"
                  />
                  <Text>{t(`layout.sidebar.menu.help.label`)}</Text>
                </Box>
              </Link>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};