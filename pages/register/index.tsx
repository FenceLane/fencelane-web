import React from "react";
import { RegisterForm } from "../../components/RegisterForm/RegisterForm";
import { InferPagePropsType } from "../../lib/types";
import { withTranslationProps } from "../../lib/server/middlewares/withTranslationProps";
import { Layout } from "../../components/Layout/Layout";
import { useContent } from "../../lib/util/hooks/useContent";

const RegisterPage = (props: InferPagePropsType<typeof getStaticProps>) => {
  const { t } = useContent("pages.register");
  return (
    <Layout title={t("title")} hideSidebar>
      <RegisterForm />
    </Layout>
  );
};

export default RegisterPage;

export const getStaticProps = withTranslationProps(async () => {
  return {
    props: {},
  };
});
