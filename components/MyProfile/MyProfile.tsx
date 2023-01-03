import { Button } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { apiClient } from "../../lib/api/apiClient";
import { useContent } from "../../lib/hooks/useContent";
import { mapAxiosErrorToLabel } from "../../lib/server/BackendError/BackendError";
import { timeToDate } from "../../lib/util/dates";
import { toastError, toastInfo } from "../../lib/util/toasts";
import { Layout } from "../Layout/Layout";
import { InferGetServerSidePropsType } from "next";
import { UserInfo } from "../../lib/types";

export interface MyProfileProps {
  user: UserInfo;
  session: {
    id: string;
    createdAt: number;
    updatedAt: number;
    expiresAt: number;
  };
}

export const MyProfile = ({ user, session }: MyProfileProps) => {
  const { t } = useContent();
  const router = useRouter();

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
        <h3>Informacje o bieżącej sessji:</h3>
        <pre>
          <p>id: {session.id}</p>
          <p>Data utworzenia: {timeToDate(session.createdAt)}</p>
          <p>Data odświeżenia: {timeToDate(session.updatedAt)}</p>
          <p>Data wygaśnięcia: {timeToDate(session.expiresAt)}</p>
        </pre>
        <Button onClick={handleLogout} colorScheme="teal" variant="outline">
          wyloguj się
        </Button>
        <Button
          onClick={handleDeleteAccount}
          colorScheme="red"
          variant="outline"
        >
          usuń konto
        </Button>
      </main>
    </>
  );
};
