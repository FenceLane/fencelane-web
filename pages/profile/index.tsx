import { Button } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Layout } from "../../components/Layout/Layout";
import { apiClient } from "../../lib/api/apiClient";
import { mapAxiosErrorToLabel } from "../../lib/server/BackendError/BackendError";
import { withServerSideAuth } from "../../lib/server/middlewares/withServerSideAuth";
import { withTranslationProps } from "../../lib/server/middlewares/withTranslationProps";
import { timeToDate } from "../../lib/util/dates";
import { useContent } from "../../lib/hooks/useContent";
import { toastError, toastInfo } from "../../lib/util/toasts";
import { MyProfile } from "../../components/MyProfile/MyProfile";

const MyProfilePage = () => {
  const { t } = useContent("pages.profile");
  return (
    <Layout>
      <MyProfile user={props.user} session={props.session} />
    </Layout>
  );
};

export default MyProfilePage;

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
