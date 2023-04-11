import { Layout } from "../../components/Layout/Layout";
import { withServerSideAuth } from "../../lib/server/middlewares/withServerSideAuth";
import { withTranslationProps } from "../../lib/server/middlewares/withTranslationProps";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";

const CalculationsPage = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  return <Layout user={user}>Tu będą chyba kalkulacje</Layout>;
};

export default CalculationsPage;

export const getServerSideProps = withTranslationProps(
  withServerSideAuth(async (ctx) => {
    const { user } = ctx.session;

    return {
      props: {
        user,
      },
    };
  })
);
