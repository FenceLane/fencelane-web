import React from "react";
import { RegisterForm } from "../../components/RegisterForm/RegisterForm";
import styles from "../../styles/Home.module.scss";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticPropsContext } from "next";
import { InferPagePropsType } from "../../lib/types";

const RegisterPage = (props: InferPagePropsType<typeof getStaticProps>) => {
  return (
    <main className={styles.main}>
      <RegisterForm />
    </main>
  );
};
export default RegisterPage;

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  const localeProps = locale
    ? await serverSideTranslations(locale, ["common"])
    : undefined;

  return {
    props: {
      ...localeProps,
    },
  };
}
