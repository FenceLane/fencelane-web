import React from "react";
import { RegisterForm } from "../../components/RegisterForm/RegisterForm";
import styles from "../../styles/Home.module.scss";
const RegisterPage = () => {
  return (
    <main className={styles.main}>
      <RegisterForm></RegisterForm>
    </main>
  );
};

export default RegisterPage;
