import { Layout } from "../../components/Layout/Layout";
import { withServerSideAuth } from "../../lib/server/middlewares/withServerSideAuth";
import { withTranslationProps } from "../../lib/server/middlewares/withTranslationProps";
import { InferGetServerSidePropsType } from "next";
import { Orders } from "../../components/Orders/Orders";

const StoragePage = ({
  user,
  orders,
}: InferGetServerSidePropsType<typeof getServerSideProps> & any) => {
  return (
    <Layout user={user}>
      <Orders />
    </Layout>
  );
};

export default StoragePage;

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
