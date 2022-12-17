import React from "react";
import { RegisterForm } from "../../components/RegisterForm/RegisterForm";
import styles from "../../styles/Home.module.scss";
import { InferPagePropsType } from "../../lib/types";
import { withTranslationProps } from "../../lib/server/middlewares/withTranslationProps";

const RegisterPage = (props: InferPagePropsType<typeof getStaticProps>) => {
  return (
    <main className={styles.main}>
      <RegisterForm />
    </main>
  );
};

export default RegisterPage;

export const getStaticProps = withTranslationProps(async () => {
  return {
    props: {},
  };
});
