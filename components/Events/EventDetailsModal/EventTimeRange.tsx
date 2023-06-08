import moment from "moment";
import { useContent } from "../../../lib/hooks/useContent";
import { EventInfo } from "../../../lib/types";
import { Text } from "@chakra-ui/react";

export const EventTimeRange = ({
  event,
}: {
  event: Pick<EventInfo, "startDate" | "endDate">;
}) => {
  const { t } = useContent();

  const [
    [startDate, startDay, startWeekDay, startTime],
    [endDate, endDay, endWeekDay, endTime],
  ] = [event.startDate, event.endDate].map((date) => [
    moment(date).format("LL"),
    moment(date).format("d"),
    moment(date).format("dddd"),
    moment(date).format("HH:mm"),
  ]);

  const isOneDayEvent = startDate === endDate;
  const isAllDayEvent =
    [1, 0].includes(Math.abs(Number(startDay) - Number(endDay))) &&
    startTime === "00:00" &&
    endTime === "00:00";

  if (isOneDayEvent) {
    return (
      <>
        <Text as="span" textTransform="capitalize">
          {startWeekDay}
          {", "}
        </Text>
        <Text as="span">{startDate}</Text>{" "}
        <Text as="span" textDecoration="underline">
          {startTime} - {endTime}
        </Text>
      </>
    );
  }

  if (isAllDayEvent) {
    return (
      <>
        <Text as="span">
          {startDate} ({startWeekDay}) - {t("main.dateAllDay")}
        </Text>
      </>
    );
  }

  return (
    <>
      <Text as="span">
        {t("main.dateSince")} {startDate} ({startWeekDay}), {startTime}
      </Text>
      <br />
      <Text as="span">
        {t("main.dateTo")} {endDate} ({endWeekDay}), {endTime}
      </Text>
    </>
  );
};
