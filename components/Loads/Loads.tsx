import React, { useRef, useState } from "react";
import { Button, Flex, IconButton, Input, Text } from "@chakra-ui/react";
import { OrderInfo } from "../../lib/types";
import { LoadsRow } from "./LoadsRow/LoadsRow";
import { AddIcon, CalendarIcon, CloseIcon } from "@chakra-ui/icons";
import { useContent } from "../../lib/hooks/useContent";
import Link from "next/link";
import styles from "./Loads.module.scss";
import { useOnClickOutside } from "../../lib/hooks/useOnClickOutside";
import { constructLoadDate } from "../../lib/util/dateUtils";

interface LoadsProps {
  loads: OrderInfo[];
}

const initialFilters = {
  dateStart: "",
  dateEnd: "",
  specificDate: "",
  search: "",
};

export const Loads = ({ loads }: LoadsProps) => {
  const { t } = useContent();

  const [showFilters, setShowFilters] = useState(false);

  const [showDateFilters, setShowDateFilters] = useState(false);

  const [filters, setFilters] = useState(initialFilters);

  const ref = useRef<HTMLDivElement | null>(null);

  useOnClickOutside(ref, () => setShowDateFilters(false));

  const toggleOpenFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const toggleOpenDateFilters = () => {
    setShowDateFilters((prev) => !prev);
  };

  const handleChangeFilters = (e: {
    target: { name: string; value: string };
  }) => {
    if (e.target.name === "dateStart" || e.target.name === "dateEnd") {
      setFilters((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
        specificDate: "",
      }));
    } else {
      setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleChangeSpecificDate = (newSpecificDate: string) => {
    setFilters((prev) => ({
      ...prev,
      specificDate: newSpecificDate,
      dateStart: "",
      dateEnd: "",
    }));
  };

  const handleDeleteSearch = () => {
    setFilters((prev) => ({ ...prev, search: "" }));
  };

  const handleDeleteDate = () => {
    setFilters((prev) => ({
      ...prev,
      dateStart: "",
      dateEnd: "",
      specificDate: "",
    }));
  };

  return (
    <>
      <Text color="var(--dark)" fontSize="20px" fontWeight="500" m="10px">
        {t("pages.loads.load_history")}
      </Text>
      <Flex justifyContent="space-between">
        <Button
          fontWeight="400"
          h="32px"
          m="0 10px 10px 0"
          backgroundColor="var(--dark)"
          color="white"
          onClick={toggleOpenFilters}
        >
          Filtry
        </Button>
        <Link href="/loads/create">
          <Button
            color="white"
            backgroundColor="var(--add-button-color)"
            fontWeight="400"
            h="32px"
            m="0 10px 10px 0"
          >
            {t("pages.loads.buttons.new")}
            <AddIcon ml="10px" />
          </Button>
        </Link>
      </Flex>
      {showFilters && (
        <Flex
          className={styles["filters-container"]}
          flexDirection="column"
          flexWrap="wrap"
        >
          <Flex flexDirection="column" mb="10px" position="relative">
            <Flex gap="10px" flexWrap="wrap">
              <Button
                bg="white"
                onClick={toggleOpenDateFilters}
                className={styles["filter-input"]}
              >
                {t("pages.loads.check-date")} &nbsp; <CalendarIcon />
              </Button>
              {((filters.dateStart && filters.dateEnd) ||
                filters.specificDate) && (
                <>
                  <Flex gap="10px">
                    <Button
                      _hover={{ background: "green" }}
                      cursor="default"
                      bg="green"
                      color="white"
                    >
                      {filters.dateStart && filters.dateEnd && (
                        <Text>{`${constructLoadDate(filters.dateStart).slice(
                          0,
                          -5
                        )} - ${constructLoadDate(filters.dateEnd).slice(
                          0,
                          -5
                        )}`}</Text>
                      )}
                      {filters.specificDate && (
                        <Text>{t(`dates.${filters.specificDate}`)}</Text>
                      )}
                    </Button>
                    <IconButton
                      colorScheme="red"
                      aria-label="Delete date filter"
                      icon={<CloseIcon />}
                      onClick={handleDeleteDate}
                    />
                  </Flex>
                </>
              )}
            </Flex>
            {showDateFilters && (
              <Flex
                className={styles["date-filters"]}
                gap="10px"
                flexDir="column"
                ref={ref}
                bg="gray.200"
              >
                <Flex flexDir="row" alignItems="end" gap="10px">
                  <Flex flexDir="column">
                    <label>{t("pages.loads.from")}</label>
                    <Input
                      bg="gray.50"
                      type="date"
                      name="dateStart"
                      onChange={handleChangeFilters}
                      value={filters.dateStart}
                    />
                  </Flex>
                  <Flex flexDir="column">
                    <label>{t("pages.loads.to")}</label>
                    <Input
                      bg="gray.50"
                      type="date"
                      name="dateEnd"
                      onChange={handleChangeFilters}
                      value={filters.dateEnd}
                    />
                  </Flex>
                </Flex>
                <Flex flexDir="column" gap="5px">
                  <Button
                    bg="gray.50"
                    variant="outline"
                    onClick={() => handleChangeSpecificDate("today")}
                  >
                    {t(`dates.today`)}
                  </Button>
                  <Button
                    bg="gray.50"
                    variant="outline"
                    onClick={() => handleChangeSpecificDate("yesterday")}
                  >
                    {t(`dates.yesterday`)}
                  </Button>
                  <Button
                    bg="gray.50"
                    variant="outline"
                    onClick={() => handleChangeSpecificDate("this-month")}
                  >
                    {t(`dates.this-month`)}
                  </Button>
                  <Button
                    bg="gray.50"
                    variant="outline"
                    onClick={() => handleChangeSpecificDate("last-month")}
                  >
                    {t(`dates.last-month`)}
                  </Button>
                  <Button
                    bg="gray.50"
                    variant="outline"
                    onClick={() =>
                      handleChangeSpecificDate("last-three-months")
                    }
                  >
                    {t(`dates.last-three-months`)}
                  </Button>
                </Flex>
              </Flex>
            )}
          </Flex>
          <Flex flexDirection="column" mb="10px">
            <Flex flexDirection="row" gap="10px">
              <Input
                placeholder={t("pages.loads.search")}
                className={styles["filter-input"]}
                bg="white"
                type="text"
                name="search"
                onChange={handleChangeFilters}
                value={filters.search}
              />
              {filters.search !== "" && (
                <IconButton
                  colorScheme="red"
                  aria-label="Delete date filter"
                  icon={<CloseIcon />}
                  onClick={handleDeleteSearch}
                />
              )}
            </Flex>
          </Flex>
        </Flex>
      )}
      <Flex flexDirection="column">
        {loads
          .filter((load) => {
            let dateBool = true;
            const loadDate = new Date(load.createdAt);
            loadDate.setHours(0, 0, 0, 0);

            if (filters.dateStart && filters.dateEnd) {
              const dateStart = new Date(filters.dateStart);
              const dateEnd = new Date(filters.dateEnd);
              dateStart.setHours(0, 0, 0, 0);
              dateEnd.setHours(0, 0, 0, 0);
              if (loadDate < dateStart || loadDate > dateEnd) {
                dateBool = false;
              }
            }

            if (filters.specificDate) {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const yesterday = new Date(
                new Date().setDate(new Date().getDate() - 1)
              );
              const firstDayOfThisMonth = new Date(
                today.getFullYear(),
                today.getMonth(),
                1
              );
              const firstDayOfLastMonth = new Date(
                today.getFullYear(),
                today.getMonth() - 1,
                1
              );
              const lastDayOfLastMonth = new Date(
                today.getFullYear(),
                today.getMonth(),
                0
              );
              const threeMonthsAgo = new Date(
                new Date().setMonth(new Date().getMonth() - 3)
              );
              switch (filters.specificDate) {
                case "today":
                  if (loadDate.getDate() !== today.getDate()) {
                    dateBool = false;
                  }
                  break;
                case "yesterday":
                  if (loadDate.getDate() !== yesterday.getDate()) {
                    dateBool = false;
                  }
                  break;
                case "this-month":
                  if (loadDate < firstDayOfThisMonth) {
                    dateBool = false;
                  }
                  break;
                case "last-month":
                  if (
                    loadDate < firstDayOfLastMonth ||
                    loadDate > lastDayOfLastMonth
                  ) {
                    dateBool = false;
                  }
                  break;
                case "last-three-months":
                  if (loadDate < threeMonthsAgo) {
                    dateBool = false;
                  }
                  break;
              }
            }

            const clientBool = load.destination.client.name
              .toLowerCase()
              .includes(filters.search);

            const destinationBool =
              load.destination.address.toLowerCase().includes(filters.search) ||
              load.destination.city.toLowerCase().includes(filters.search) ||
              load.destination.country.toLowerCase().includes(filters.search) ||
              load.destination.postalCode
                .toLowerCase()
                .includes(filters.search);

            const loadIdBool = load.id === Number(filters.search);
            return (
              dateBool &&
              (clientBool ||
                destinationBool ||
                loadIdBool ||
                filters.search === "")
            );
          })
          .map((load) => (
            <LoadsRow key={load.id} loadData={load} />
          ))}
      </Flex>
    </>
  );
};
