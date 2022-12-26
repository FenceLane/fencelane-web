import { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { Layout } from "../components/Layout/Layout";
import { withServerSideAuth } from "../lib/server/middlewares/withServerSideAuth";
import { withTranslationProps } from "../lib/server/middlewares/withTranslationProps";
import styles from "../styles/Home.module.scss";

export default function Home({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>FenceLane</title>
        <meta name="description" content="Managing palisades the good way." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout user={user}>
        <div className={styles.container}>
          <h1 className={styles.title}>FenceLane</h1>
        </div>
      </Layout>
    </>
  );
}

export const getServerSideProps = withTranslationProps(
  withServerSideAuth(async (ctx) => {
    return {
      props: { user: ctx.session.user },
    };
  })
);
