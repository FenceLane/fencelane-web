import {
  Box,
  Grid,
  GridItem,
  Text,
  Image,
  Button,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { TriangleDownIcon } from "@chakra-ui/icons";
import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import MagazynIcon from "../../public/images/navicons/magazyn.svg";
import ProfileInfoDropdown from "../ProfileInfoDropdown/ProfileInfoDropdown";

export interface LayoutProps {
  children: any;
}

export const Layout = ({ children }: LayoutProps) => {
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
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,200;0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Grid
        templateAreas={`"header header"
                  "nav main"
                  "nav footer"`}
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
            <Image width="22px" src={"./images/logo.svg"}></Image>
            <Image width="126px" src={"./images/textlogo.svg"}></Image>
          </Box>
          <ProfileInfoDropdown />
        </GridItem>
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
          fontSize={16}
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
                <Box
                  key={option}
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
                    src={`./images/navicons/${option}.svg`}
                  ></Image>
                  <Text>{option}</Text>
                </Box>
              ))}
            </Box>
            <Box>
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
                ></Image>
                <Text>Ustawienia</Text>
              </Box>
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
                <Image width="16px" src={`./images/navicons/pomoc.svg`}></Image>
                <Text>Pomoc</Text>
              </Box>
            </Box>
          </Box>
        </GridItem>
        <GridItem pl="2" bg="#EBEBEB" color="black" area={"main"}>
          {children}
        </GridItem>
        <GridItem pl="2" bg="#333" area={"footer"}>
          <Text textAlign="center">
            Created by{" "}
            <a href="https://github.com/FenceLane" rel="noreferrer noopener">
              FenceLane
            </a>
          </Text>
        </GridItem>
      </Grid>
    </>
  );
};
