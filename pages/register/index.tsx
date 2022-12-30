import React from "react";
import { RegisterForm } from "../../components/RegisterForm/RegisterForm";
import { withTranslationProps } from "../../lib/server/middlewares/withTranslationProps";
import { Layout } from "../../components/Layout/Layout";
import { useContent } from "../../lib/hooks/useContent";

const RegisterPage = () => {
  const { t } = useContent("pages.register");
  return (
    <Layout title={t("title")} hideSidebar>
      <RegisterForm />
    </Layout>
  );
};

export default RegisterPage;

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
