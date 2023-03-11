import { Box, Link, Image, Flex } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { useContent } from "../../lib/hooks/useContent";
import ProfileInfoDropdown from "../ProfileInfoDropdown/ProfileInfoDropdown";
import styles from "./Header.module.scss";
import { UserInfo } from "../../lib/types";
import clsx from "clsx";

export interface HeaderProps {
  isMobile: boolean;
  user?: UserInfo;
  isMenuActive: boolean;
  setMenuActive: Function;
}

export const Header = ({
  isMobile,
  user,
  isMenuActive,
  setMenuActive,
}: HeaderProps) => {
  const { t } = useContent("general");
  return (
    <Box className={styles.header}>
      <Link
        className={styles.logos}
        as={NextLink}
        href="/"
        aria-label={t("layout.header.logo.label")}
        ml="10px"
      >
        <Image className={styles.logo} src={"/images/logo.svg"} alt="" />
        {!isMobile && (
          <Image
            className={styles["text-logo"]}
            src={"/images/textlogo.svg"}
            alt=""
          />
        )}
      </Link>
      {isMobile && (
        <Image
          className={styles["text-logo"]}
          src={"/images/textlogo.svg"}
          alt=""
        />
      )}
      <Flex className={styles["header-right"]}>
        {user && (
          <>
            <ProfileInfoDropdown
              name={user.name}
              variant={isMobile ? "avatar" : "name"}
            />
            {isMobile && (
              <button
                className={
                  isMenuActive
                    ? clsx(styles.hamburger, styles["is-active"])
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
  );
};
