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
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { apiClient } from "../../lib/api/apiClient";
import { useContent } from "../../lib/hooks/useContent";
import { mapAxiosErrorToLabel } from "../../lib/server/BackendError/BackendError";
import { toastError, toastInfo } from "../../lib/util/toasts";
import { UserInfo } from "../../lib/types";
import styles from "./MyProfile.module.scss";

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
    <>
      <main>
        <Heading as="h3" size="lg" mb={5}>
          Mój profil
        </Heading>
        <Text fontSize={18} mb={2}>
          Dane użytkownika:
        </Text>
        <Text className={styles["profile-item"]}>
          Nazwa użytkownika: <span>{user.name}</span>
        </Text>
        <Text className={styles["profile-item"]}>
          E-mail: <span>{user.email}</span>
        </Text>
        <Text className={styles["profile-item"]}>
          <span>ID:</span> <span>{user.id}</span>
        </Text>
        <Text className={styles["profile-item"]}>
          Telefon: <span>{user.phone}</span>
        </Text>
        <Text className={styles["profile-item"]}>
          Rola: <span>{user.role}</span>
        </Text>
        <div className={styles.buttons}>
          <Button
            onClick={handleLogout}
            colorScheme="teal"
            variant="outline"
            mr={3}
          >
            Wyloguj się
          </Button>
          <Button colorScheme="red" variant="outline" onClick={onOpen}>
            Usuń konto
          </Button>
        </div>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Usuwanie konta</ModalHeader>
            <ModalCloseButton />
            <ModalBody>Czy na pewno chcesz usunąć konto?</ModalBody>
            <ModalFooter>
              <Button colorScheme="red" onClick={handleDeleteAccount} mr={3}>
                Usuń konto
              </Button>
              <Button colorScheme="green" onClick={onClose}>
                Anuluj
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </main>
    </>
  );
};
