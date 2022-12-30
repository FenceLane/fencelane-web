import React from "react";
import { Layout } from "../../components/Layout/Layout";
import { LoginForm } from "../../components/LoginForm/LoginForm";
import { withTranslationProps } from "../../lib/server/middlewares/withTranslationProps";
import { useContent } from "../../lib/hooks/useContent";

const LoginPage = () => {
  const { t } = useContent("pages.login");

  return (
    <Layout title={t("title")} hideSidebar>
      <LoginForm />
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
