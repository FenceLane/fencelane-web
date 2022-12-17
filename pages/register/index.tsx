import React from "react";
import { RegisterForm } from "../../components/RegisterForm/RegisterForm";
import styles from "../../styles/Home.module.scss";
import { InferPagePropsType } from "../../lib/types";
import { withServerSideTranslations } from "../../lib/server/middlewares/withServerSideTranslations";

const RegisterPage = (props: InferPagePropsType<typeof getStaticProps>) => {
  return (
    <main className={styles.main}>
      <RegisterForm />
    </main>
  );
};

export default RegisterPage;

export const getStaticProps = withServerSideTranslations(async () => {
  return {
    props: {},
  };
});
