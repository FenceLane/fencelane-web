import { Box, Grid, GridItem, Text, Image } from "@chakra-ui/react";
import React from "react";
import magazynIcon from "../../public/images/navicons/magazyn.svg";

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
    <Grid
      templateAreas={`"header header"
                  "nav main"
                  "nav footer"`}
      gridTemplateRows={"50px 1fr 30px"}
      gridTemplateColumns={"200px 1fr"}
      h="100vh"
      color="blackAlpha.700"
      fontWeight="bold"
    >
      <GridItem
        pl="2"
        bg="white"
        color="white"
        area={"header"}
        display="flex"
        flexDir="row"
        justifyContent="space-between"
        boxShadow="0px 6px 12px -7px rgba(66, 68, 90, 1)"
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
        <Box w={200} className="userInfo"></Box>
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
  );
};
