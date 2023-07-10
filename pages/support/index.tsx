import { Layout } from "../../components/Layout/Layout";
import { Support } from "../../components/Support/Support";
import { withServerSideAuth } from "../../lib/server/middlewares/withServerSideAuth";
import { withTranslationProps } from "../../lib/server/middlewares/withTranslationProps";
import { InferGetServerSidePropsType } from "next";
const SupportPage = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Layout user={user}>
      <Support />
    </Layout>
  );
};

export default SupportPage;

export const getServerSideProps = withTranslationProps(
  withServerSideAuth()(async (ctx) => {
    const { user } = ctx.session;

    return {
      props: {
        user,
      },
    };
  })
);
