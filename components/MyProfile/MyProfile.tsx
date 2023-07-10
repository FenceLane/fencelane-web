import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Heading,
  Text,
  Flex,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { apiClient } from "../../lib/api/apiClient";
import { useContent } from "../../lib/hooks/useContent";
import { mapAxiosErrorToLabel } from "../../lib/server/BackendError/BackendError";
import { toastError, toastInfo } from "../../lib/util/toasts";
import { UserInfo } from "../../lib/types";
import styles from "./MyProfile.module.scss";
import { getRoleByNumber } from "../../lib/util/userRoles";

export interface MyProfileProps {
  user: UserInfo;
}

export const MyProfile = ({ user }: MyProfileProps) => {
  const { t } = useContent();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLogout = () => {
    apiClient.auth
      .deleteLogout()
      .then(() => toastInfo(t("success.logout")))
      .catch((error) => {
        toastError(
          t(`errors.backendErrorLabel.${mapAxiosErrorToLabel(error)}`)
        );
      })
      .finally(() => {
        router.push("/login");
      });
  };

  const handleDeleteAccount = () => {
    apiClient.auth
      .deleteSelfUser()
      .then(() => toastInfo(t("success.delete")))
      .catch((error) => {
        toastError(
          t(`errors.backendErrorLabel.${mapAxiosErrorToLabel(error)}`)
        );
      })
      .finally(() => {
        router.push("/login");
      });
  };

  return (
    <Flex bg="white" flexDir="column" className={styles["profile-container"]}>
      <Heading as="h3" size="lg" mb={5}>
        {t("pages.my_profile.my_profile")}
      </Heading>
      <Text fontSize={18} mb={2}>
        {t("pages.my_profile.user_data")}:
      </Text>
      <Text className={styles["profile-item"]}>
        {t("pages.my_profile.username")}: <span>{user.name}</span>
      </Text>
      <Text className={styles["profile-item"]}>
        E-mail: <span>{user.email}</span>
      </Text>
      <Text className={styles["profile-item"]}>
        <span>ID:</span> <span>{user.id}</span>
      </Text>
      <Text className={styles["profile-item"]}>
        {t("pages.my_profile.phone")}: <span>{user.phone}</span>
      </Text>
      <Text className={styles["profile-item"]}>
        {t("pages.my_profile.role")}:{" "}
        <span>{t(`pages.employees.roles.${getRoleByNumber(user.role)}`)}</span>
      </Text>
      <div className={styles.buttons}>
        <Button
          onClick={handleLogout}
          colorScheme="teal"
          variant="outline"
          mr={3}
        >
          {t("pages.my_profile.logout")}
        </Button>
        <Button colorScheme="red" variant="outline" onClick={onOpen}>
          {t("pages.my_profile.delete_account")}
        </Button>
      </div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("pages.my_profile.account_deletion")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{t("pages.my_profile.are_you_sure")}</ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={handleDeleteAccount} mr={3}>
              {t("pages.my_profile.delete_account")}
            </Button>
            <Button colorScheme="green" onClick={onClose}>
              {t("buttons.cancel")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};
