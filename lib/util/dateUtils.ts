import { i18n } from "next-i18next";

const days = i18n
  ? [
      i18n.t("days.monday"),
      i18n.t("days.tuesday"),
      i18n.t("days.wednesday"),
      i18n.t("days.thursday"),
      i18n.t("days.friday"),
      i18n.t("days.saturday"),
      i18n.t("days.sunday"),
    ]
  : [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

export const constructRateDate = (rate: {
  no: string;
  effectiveDate: Date;
  mid: number;
}) => {
  const date = new Date(rate.effectiveDate);

  const displayDate =
    (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
    "." +
    (Number(date.getMonth()) + 1 < 10
      ? "0" + String(Number(date.getMonth()) + 1)
      : Number(date.getMonth()) + 1) +
    "." +
    date.getFullYear();
  return displayDate;
};

export const constructOrderDate = (rawDate: Date) => {
  const date = new Date(rawDate);
  return (
    (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
    "." +
    (Number(date.getMonth()) + 1 < 10
      ? "0" + String(Number(date.getMonth()) + 1)
      : Number(date.getMonth()) + 1) +
    "." +
    date.getFullYear() +
    " | " +
    days[date.getDay()].substring(0, 3)
  );
};
