import { Box, Link, Text } from "@chakra-ui/react";
import React from "react";
import { UserInfo } from "../../lib/types";
import styles from "./Footer.module.scss";
import NextLink from "next/link";

export interface FooterProps {
  user?: UserInfo;
  isMobile: boolean;
}

export const Footer = ({ user, isMobile }: FooterProps) => {
  return (
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
  );
};
