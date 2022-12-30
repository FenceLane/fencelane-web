import { Box, Grid, GridItem, Text, Image, Link, Flex } from "@chakra-ui/react";
import Head from "next/head";
import React, { ReactNode, useState } from "react";
import ProfileInfoDropdown from "../ProfileInfoDropdown/ProfileInfoDropdown";
import NextLink from "next/link";
import { useContent } from "../../lib/hooks/useContent";
import "react-toastify/dist/ReactToastify.css";
import { UserInfo } from "../../lib/types";
import styles from "./Layout.module.scss";
import cx from "classnames";
import Div100vh, { use100vh } from "react-div-100vh";
import useIsMobile from "../../lib/hooks/useIsMobile";

export interface LayoutProps {
  children: ReactNode;
  title?: string;
  user?: UserInfo;
  hideSidebar?: boolean;
}

const menuItems = [
  {
    name: "stats",
    icon: "statystyki",
  },
  {
    name: "magazine",
    icon: "magazyn",
  },
  {
    name: "orders",
    icon: "zamówienia",
  },
  {
    name: "commissions",
    icon: "zlecenia",
  },
  {
    name: "schedule",
    icon: "harmonogram",
  },
  {
    name: "calculations",
    icon: "kalkulacje",
  },
  {
    name: "chat",
    icon: "czat",
  },
  {
    name: "employees",
    icon: "pracownicy",
  },
];

export const Layout = ({
  children,
  title,
  user,
  hideSidebar = false,
}: LayoutProps) => {
  const { t } = useContent("general");
  const [isMenuActive, setMenuActive] = useState(false);
  const isMobile = useIsMobile();

  const height = use100vh();
  const actualHeight = height ? height - 50 : "95vh";

  return (
    <>
      <Head>
        <title>{`${t("title")}${title ? ` | ${title}` : ""}`}</title>
      </Head>
      <Box className={styles.header}>
        <Link
          className={styles.logos}
          as={NextLink}
          href="/"
          aria-label={t("layout.header.logo.label")}
        >
          <Image className={styles.logo} src={"./images/logo.svg"} alt="" />
          {!isMobile && (
            <Image
              className={styles["text-logo"]}
              src={"./images/textlogo.svg"}
              alt=""
            />
          )}
        </Link>
        <Flex className={styles["header-right"]}>
          {user && (
            <>
              <ProfileInfoDropdown name={user.name} mobile={isMobile} />
              {isMobile && (
                <button
                  className={
                    isMenuActive
                      ? cx(styles.hamburger, styles["is-active"])
                      : styles.hamburger
                  }
                  type="button"
                  onClick={() => setMenuActive(!isMenuActive)}
                >
                  <span className={styles["hamburger-box"]}>
                    <span className={styles["hamburger-inner"]}></span>
                  </span>
                </button>
              )}
            </>
          )}
        </Flex>
      </Box>
      {!hideSidebar && (isMenuActive || !isMobile) && (
        <Box className={styles.nav} height={actualHeight}>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="space-between"
            alignItems="center"
            h="100%"
          >
            <Box display="flex" flexDir="column" justifyContent="center">
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
            <Box display="flex" flexDir="column" justifyContent="center">
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
      <Box
        color="black"
        className={styles.content}
        pl={user && !isMobile ? 220 : 2.5}
      >
        {children}
      </Box>
      <Box className={styles.footer} pl={user && !isMobile ? 200 : 0}>
        <Text textAlign="center" fontWeight="400">
          Created by{" "}
          <Link
            as={NextLink}
            href="https://github.com/FenceLane"
            rel="noreferrer noopener"
            fontWeight="600"
          >
            FenceLane
          </Link>{" "}
          for{" "}
          <Link
            as={NextLink}
            href="https://github.com/FenceLane"
            rel="noreferrer noopener"
            fontWeight="600"
          >
            Drebud
          </Link>
        </Text>
      </Box>
    </>
  );
};
