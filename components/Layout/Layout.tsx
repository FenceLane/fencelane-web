import { Box, Grid, GridItem, Text, Image, Link } from "@chakra-ui/react";
import Head from "next/head";
import React, { ReactNode } from "react";
import ProfileInfoDropdown from "../ProfileInfoDropdown/ProfileInfoDropdown";
import NextLink from "next/link";
import { useContent } from "../../lib/util/hooks/useContent";
import "react-toastify/dist/ReactToastify.css";
import { UserInfo } from "../../lib/types";

export interface LayoutProps {
  children: ReactNode;
  title?: string;
  user?: UserInfo;
  hideSidebar?: boolean;
}

export const Layout = ({
  children,
  title,
  user,
  hideSidebar = false,
}: LayoutProps) => {
  const { t } = useContent("general");

  const id = {
    name: "",
    photo: "",
    menuoptions: [
      "statystyki",
      "magazyn",
      "zamówienia",
      "zlecenia",
      "harmonogram",
      "kalkulacje",
      "czat",
      "pracownicy",
    ],
  };

  const templateAreas = hideSidebar
    ? `
    "header header"
    "main main"
    "footer footer"
    `
    : `
    "header header"
    "nav main"
    "nav footer"
    `;

  return (
    <>
      <Head>
        <title>{`${t("title")}${title ? ` | ${title}` : ""}`}</title>
      </Head>
      <Grid
        templateAreas={templateAreas}
        gridTemplateRows={"50px 1fr 30px"}
        gridTemplateColumns={"200px 1fr"}
        h="100vh"
        color="blackAlpha.700"
        fontWeight="normal"
      >
        <GridItem
          pl="2"
          bg="white"
          color="white"
          area={"header"}
          display="flex"
          flexDir="row"
          justifyContent="space-between"
          position="relative"
          boxShadow="0px 6px 6px -7px rgba(66, 68, 90, 1)"
        >
          <Box
            w={200}
            gap="16px"
            m="11px"
            className="logo"
            display="flex"
            flexDirection="row"
          >
            <Image width="22px" src={"./images/logo.svg"} />
            <Image width="126px" src={"./images/textlogo.svg"} />
          </Box>
          {user && <ProfileInfoDropdown name={user.name || ""} />}
        </GridItem>
        {!hideSidebar && (
          <GridItem
            pl="2"
            bg="#333"
            color="white"
            area={"nav"}
            display="flex"
            flexDir="column"
            justifyContent="space-between"
            alignItems="center"
            h="100%"
            p="25px 0"
            fontSize="16px"
            fontWeight="medium"
          >
            <Box
              display="flex"
              flexDir="column"
              justifyContent="space-between"
              h="100%"
            >
              <Box>
                {id.menuoptions.map((option) => (
                  <Link
                    as={NextLink}
                    key={option}
                    href=""
                    _hover={{
                      textDecoration: "none",
                    }}
                  >
                    <Box
                      display="flex"
                      flexDir="row"
                      alignItems="center"
                      gap="16px"
                      textTransform="capitalize"
                      color="#C2C2C2"
                      height="50px"
                      width="auto"
                      _hover={{
                        color: "white",
                      }}
                    >
                      <Image
                        width="16px"
                        src={`./images/navicons/${option}.svg`}
                      />
                      <Text>{option}</Text>
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
                  <Box
                    display="flex"
                    flexDir="row"
                    alignItems="center"
                    gap="16px"
                    textTransform="capitalize"
                    color="#C2C2C2"
                    height="50px"
                    width="auto"
                  >
                    <Image
                      width="16px"
                      src={`./images/navicons/ustawienia.svg`}
                    />
                    <Text
                      _hover={{
                        color: "white",
                      }}
                    >
                      Ustawienia
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
                  <Box
                    display="flex"
                    flexDir="row"
                    alignItems="center"
                    gap="16px"
                    textTransform="capitalize"
                    color="#C2C2C2"
                    height="50px"
                    width="auto"
                  >
                    <Image width="16px" src={`./images/navicons/pomoc.svg`} />
                    <Text
                      _hover={{
                        color: "white",
                      }}
                    >
                      Pomoc
                    </Text>
                  </Box>
                </Link>
              </Box>
            </Box>
          </GridItem>
        )}
        <GridItem pl="2" bg="#EBEBEB" color="black" area={"main"}>
          {children}
        </GridItem>
        <GridItem pl="2" bg="#333" area={"footer"}>
          <Text textAlign="center" fontWeight="300" color="white">
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
        </GridItem>
      </Grid>
    </>
  );
};
