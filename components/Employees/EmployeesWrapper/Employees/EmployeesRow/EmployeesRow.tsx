import React from "react";
import { UserInfo } from "../../../../../lib/types";
import { Button, Tr, Td, useDisclosure } from "@chakra-ui/react";
import { useIsMobile } from "../../../../../lib/hooks/useIsMobile";
import { ChangeRoleModal } from "./ChangeRoleModal/ChangeRoleModal";
import { useContent } from "../../../../../lib/hooks/useContent";
import { getRoleByNumber } from "../../../../../lib/util/userRoles";

interface EmployeesRowProps {
  employee: UserInfo;
}

export const EmployeesRow = ({ employee }: EmployeesRowProps) => {
  const { t } = useContent();

  const isMobile = useIsMobile();

  const {
    isOpen: isRoleChangeOpen,
    onOpen: onRoleChangeOpen,
    onClose: onRoleChangeClose,
  } = useDisclosure();

  return (
    <>
      {!isMobile && (
        <Tr>
          <Td>{employee.name}</Td>
          <Td>
            {t(`pages.employees.roles.${getRoleByNumber(employee.role)}`)}
          </Td>
          <Td>{employee.email}</Td>
          <Td>{employee.phone}</Td>
          <Td>
            <Button colorScheme="blue" size="md" onClick={onRoleChangeOpen}>
              {t("pages.employees.table.change_role_button")}
            </Button>
          </Td>
        </Tr>
      )}
      {isMobile && (
        <>
          <Tr>
            <Td>{employee.name}</Td>
            <Td>
              {t(`pages.employees.roles.${getRoleByNumber(employee.role)}`)}
            </Td>
            <Td>
              <Button colorScheme="blue" size="xs" onClick={onRoleChangeOpen}>
                {t("pages.employees.table.change_role")}
              </Button>
            </Td>
          </Tr>
          <Tr borderBottom="5px solid var(--light-content)">
            <Td>{employee.phone}</Td>
            <Td colSpan={2}>{employee.email}</Td>
          </Tr>
        </>
      )}
      <ChangeRoleModal
        id={employee.id}
        onClose={onRoleChangeClose}
        isOpen={isRoleChangeOpen}
        oldRole={employee.role}
      />
    </>
  );
};
