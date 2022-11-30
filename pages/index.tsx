import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>FenceLane</title>
        <meta name="description" content="Managing palisades the good way." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>FenceLane</h1>
      </main>

      <footer className={styles.footer}>
        <p>
          Created by{" "}
          <a href="https://github.com/FenceLane" rel="noreferrer noopener">
            FenceLane
          </a>
        </p>
      </footer>
    </div>
  );
}
