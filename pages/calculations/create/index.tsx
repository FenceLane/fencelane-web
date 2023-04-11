import { Layout } from "../../../components/Layout/Layout";
import { withServerSideAuth } from "../../../lib/server/middlewares/withServerSideAuth";
import { withTranslationProps } from "../../../lib/server/middlewares/withTranslationProps";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";

const CalculationCreatePage = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  return (
    <Layout user={user}>
      <input />
    </Layout>
  );
};

export default CalculationCreatePage;

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
