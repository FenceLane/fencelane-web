import { Box, Flex } from "@chakra-ui/react";
import Head from "next/head";
import React, { ReactNode, useEffect, useState } from "react";
import { useContent } from "../../lib/hooks/useContent";
import "react-toastify/dist/ReactToastify.css";
import { UserInfo } from "../../lib/types";
import styles from "./Layout.module.scss";
import { useIsMobile } from "../../lib/hooks/useIsMobile";
import { Header } from "../Header/Header";
import { Nav } from "../Nav/Nav";
import { Footer } from "../Footer/Footer";
import ReactDiv100 from "react-div-100vh";
import { useUser } from "../../lib/hooks/UserContext";

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
    name: "storage",
    icon: "magazyn",
  },
  {
    name: "loads",
    icon: "załadunki",
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
    name: "employees",
    icon: "pracownicy",
  },
];

export const Layout = ({
  children,
  title,
  user: initialUser,
  hideSidebar = false,
}: LayoutProps) => {
  const { t } = useContent("general");
  const [isMenuActive, setMenuActive] = useState(false);
  const isMobile = useIsMobile();
  const { setUser } = useUser();

  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
    }
  }, [initialUser, setUser]);

  return (
    <>
      <Head>
        <title>{`${t("title")}${title ? ` | ${title}` : ""}`}</title>
      </Head>
      <ReactDiv100>
        <Flex flexDir="column" h="100%" overflow="hidden">
          {!hideSidebar && (
            <Header
              isMobile={isMobile}
              user={initialUser}
              isMenuActive={isMenuActive}
              setMenuActive={setMenuActive}
            ></Header>
          )}

          <Flex h="100%" flex="1" overflow="hidden">
            <Nav
              hideSidebar={hideSidebar}
              isMenuActive={isMenuActive}
              isMobile={isMobile}
              menuItems={menuItems}
            />
            <Box
              color="black"
              className={styles.content}
              pl={initialUser && !isMobile ? 220 : 2.5}
              bg={hideSidebar ? "white" : "var(--light-content)"}
            >
              {children}
            </Box>
          </Flex>
          <Footer user={initialUser} isMobile={isMobile}></Footer>
        </Flex>
      </ReactDiv100>
    </>
  );
};
