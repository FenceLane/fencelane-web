import React from "react";
import { Flex, Box, Text } from "@chakra-ui/react";
import { UserInfo } from "../../lib/types";
import styles from "./HomePage.module.scss";
import { useContent } from "../../lib/hooks/useContent";
import dynamic from "next/dynamic";

interface HomePageProps {
  user?: UserInfo;
}

const DigitalClock = dynamic(
  () =>
    import("../../components/HomePage/DigitalClock/DigitalClock").then(
      (module) => module.DigitalClock
    ),
  { ssr: false }
);

export const HomePage = ({ user }: HomePageProps) => {
  const { t } = useContent();

  const name = user ? user.name.split(" ")[0] : "User";
  return (
    <Flex className={styles.container}>
      <Flex flexDirection="column">
        <Box>
          <Text className={styles["fencelane"]}>FenceLane</Text>
        </Box>
        <Box>
          <Text className={styles["hello"]}>
            {t("main.hello")} {name}!
          </Text>
        </Box>
      </Flex>
      <Box>
        <DigitalClock />
      </Box>
    </Flex>
  );
};
