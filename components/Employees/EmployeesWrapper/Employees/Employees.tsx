import { Table, Tr, Th, Thead, Tbody } from "@chakra-ui/react";
import { UserInfo } from "../../../../lib/types";
import { EmployeesRow } from "./EmployeesRow/EmployeesRow";
import { useIsMobile } from "../../../../lib/hooks/useIsMobile";
import styles from "./Employees.module.scss";
import { useContent } from "../../../../lib/hooks/useContent";

interface EmployeesProps {
  employees: UserInfo[];
}
export const Employees = ({ employees }: EmployeesProps) => {
  const { t } = useContent();

  const isMobile = useIsMobile();

  return (
    <Table
      variant="striped"
      bg="white "
      colorScheme="twitter"
      width="100%"
      className={styles["employees-table"]}
      wordBreak="break-word"
      borderRadius="10px"
    >
      <Thead>
        {!isMobile && (
          <Tr>
            <Th>{t("pages.employees.table.name")}</Th>
            <Th>{t("pages.employees.table.role")}</Th>
            <Th>E-mail</Th>
            <Th>{t("pages.employees.table.phone")}</Th>
            <Th>{t("pages.employees.table.change_role")}</Th>
          </Tr>
        )}
        {isMobile && (
          <>
            <Tr bg="twitter.100">
              <Th>{t("pages.employees.table.name")}</Th>
              <Th>{t("pages.employees.table.role")}</Th>
              <Th>{t("pages.employees.table.change_role")}</Th>
            </Tr>
            <Tr borderBottom="5px solid var(--light-content)">
              <Th>{t("pages.employees.table.phone")}</Th>
              <Th colSpan={2}>E-mail</Th>
            </Tr>
          </>
        )}
      </Thead>
      <Tbody>
        {employees.map((employee) => (
          <EmployeesRow key={employee.id} employee={employee} />
        ))}
      </Tbody>
    </Table>
  );
};
