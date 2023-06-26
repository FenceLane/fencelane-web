import { Select } from "@chakra-ui/react";
import React from "react";
import { useContent } from "../../../lib/hooks/useContent";

const months = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

interface MonthSelectProps {
  selectedMonth: number;
  setSelectedMonth: Function;
}

export const MonthSelect = ({
  selectedMonth,
  setSelectedMonth,
}: MonthSelectProps) => {
  const { t } = useContent();

  const handleChangeSelectedMonth = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedMonth(e.target.value);
  };

  const createMonthSelect = (monthsArray: string[], selectedMonth: number) => {
    return monthsArray.map((month, index) => (
      <option key={index} value={index}>
        {t(`months.${month}`)}
      </option>
    ));
  };
  return (
    <Select
      cursor={"pointer"}
      fontSize="18px"
      fontWeight="600"
      width="auto"
      border="none"
      onChange={handleChangeSelectedMonth}
      defaultValue={selectedMonth}
    >
      {createMonthSelect(months, selectedMonth)}
    </Select>
  );
};
