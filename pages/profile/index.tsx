import { Button } from "@chakra-ui/react";
import { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { Layout } from "../../components/Layout/Layout";
import { apiClient } from "../../lib/api/apiClient";
import { mapAxiosErrorToLabel } from "../../lib/server/BackendError/BackendError";
import { withServerSideAuth } from "../../lib/server/middlewares/withServerSideAuth";
import { withTranslationProps } from "../../lib/server/middlewares/withTranslationProps";
import { timeToDate } from "../../lib/util/dates";
import { useContent } from "../../lib/util/hooks/useContent";
import { toastError, toastInfo } from "../../lib/util/toasts";

export default function Home({
  user,
  session,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
      <Head>
        <title>FenceLane</title>
        <meta name="description" content="Managing palisades the good way." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout user={user}>
        <main>
          <h2>Mój profil</h2>
          <h3>Dane użytkownika:</h3>
          <pre>
            <p>id: {user.id}</p>
            <p>nazwa: {user.name}</p>
            <p>email: {user.email}</p>
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
      </Layout>
    </>
  );
}

export const getServerSideProps = withTranslationProps(
  withServerSideAuth(async (ctx) => {
    const { user, ...session } = ctx.session;
    const { id, createdAt, updatedAt, expiresAt } = session;

    return {
      props: {
        user,
        session: {
          id: id,
          createdAt: createdAt.getTime(),
          updatedAt: updatedAt.getTime(),
          expiresAt: expiresAt.getTime(),
        },
      },
    };
  })
);
