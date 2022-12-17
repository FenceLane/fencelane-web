import React from "react";
import { Layout } from "../../components/Layout/Layout";
import { LoginForm } from "../../components/LoginForm/LoginForm";
import { withTranslationProps } from "../../lib/server/middlewares/withTranslationProps";
import { useContent } from "../../lib/util/useContent";

const LoginPage = () => {
  const { t } = useContent("pages.login");
  return (
    <Layout title={t("title")} showSidebar={false}>
      <LoginForm />
    </Layout>
  );
};

export default LoginPage;

export const getStaticProps = withTranslationProps(async () => {
  return {
    props: {},
  };
});
