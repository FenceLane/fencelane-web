import React from "react";
import { LoginForm } from "../../components/LoginForm/LoginForm";
import styles from "../../styles/Home.module.scss";

const LoginPage = () => {
  return (
    <main className={styles.main}>
      <LoginForm />
    </main>
  );
};

export default LoginPage;
