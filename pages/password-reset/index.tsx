import React from "react";
import { Layout } from "../../components/Layout/Layout";
import { PasswordResetForm } from "../../components/PasswordResetForm/PasswordResetForm";
import { withTranslationProps } from "../../lib/server/middlewares/withTranslationProps";
import { useContent } from "../../lib/util/hooks/useContent";

const LoginPage = () => {
  const { t } = useContent("pages.password-reset");

  return (
    <Layout title={t("title")} hideSidebar>
      <PasswordResetForm />
    </Layout>
  );
};

export default LoginPage;

export const getServerSideProps = withTranslationProps(async ({ req }) => {
  const sessionId = req.cookies.authorization;
  if (sessionId) {
    return {
      redirect: {
        permanent: true,
        destination: "/",
      },
    };
  }

  return {
    props: {},
  };
});
