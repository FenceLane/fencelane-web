import React, { useEffect, useState } from "react";
import styles from "./DigitalClock.module.scss";
import { Box, Text } from "@chakra-ui/react";
import { useContent } from "../../../lib/hooks/useContent";

export const DigitalClock = () => {
  const [time, setTime] = useState(new Date());

  const { t } = useContent();

  useEffect(() => {
    const timerID = setInterval(() => tick(), 1000);
    return () => clearInterval(timerID);
  }, []);

  const tick = () => {
    setTime(new Date());
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString();
  };

  const formatDate = (time: Date) => {
    const days = [
      t("days.sunday"),
      t("days.monday"),
      t("days.tuesday"),
      t("days.thursday"),
      t("days.wednesday"),
      t("days.friday"),
      t("days.saturday"),
    ];
    const dayName = days[time.getDay()];

    const day = time.getDate().toString().padStart(2, "0");
    const month = (time.getMonth() + 1).toString().padStart(2, "0");
    const year = time.getFullYear();

    return `${dayName}, ${day}.${month}.${year}`;
  };

  return (
    <Box className={styles["clock-box"]}>
      <Text className={styles.time}>{formatTime(time)}</Text>
      <Text className={styles.date}>{formatDate(time)}</Text>
    </Box>
  );
};
