import { Layout } from "../../../components/Layout/Layout";
import { withServerSideAuth } from "../../../lib/server/middlewares/withServerSideAuth";
import { withTranslationProps } from "../../../lib/server/middlewares/withTranslationProps";
import { InferGetServerSidePropsType } from "next";
import { LoadCreateWrapper } from "../../../components/Loads/LoadCreateWrapper/LoadCreateWrapper";

const LoadCreatePage = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Layout user={user}>
      <LoadCreateWrapper />
    </Layout>
  );
};

export default LoadCreatePage;

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
