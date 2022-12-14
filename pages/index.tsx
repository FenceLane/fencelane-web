import Head from "next/head";
import { Layout } from "../components/Layout/Layout";
import { LoginForm } from "../components/LoginForm/LoginForm";
import styles from "../styles/Home.module.scss";

export default function Home() {
  return (
    <>
      <Head>
        <title>FenceLane</title>
        <meta name="description" content="Managing palisades the good way." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className={styles.container}>
          <h1 className={styles.title}>FenceLane</h1>
        </div>
      </Layout>
    </>
  );
}
