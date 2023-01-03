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
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { apiClient } from "../../lib/api/apiClient";
import { useContent } from "../../lib/hooks/useContent";
import { mapAxiosErrorToLabel } from "../../lib/server/BackendError/BackendError";
import { timeToDate } from "../../lib/util/dates";
import { toastError, toastInfo } from "../../lib/util/toasts";
import { UserInfo } from "../../lib/types";

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
        <h2>Mój profil</h2>
        <h3>Dane użytkownika:</h3>
        <pre>
          <p>id: {user.id}</p>
          <p>nazwa: {user.name}</p>
          <p>email: {user.email}</p>
          <p>telefon: {user.phone}</p>
          <p>rola: {user.role}</p>
        </pre>
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
