import { Layout } from "../../components/Layout/Layout";
import { withServerSideAuth } from "../../lib/server/middlewares/withServerSideAuth";
import { withTranslationProps } from "../../lib/server/middlewares/withTranslationProps";
import { InferGetServerSidePropsType } from "next";
import { OrdersWrapper } from "../../components/Orders/OrdersWrapper/OrdersWrapper";
import { USER_ROLE } from "../../lib/types";

const LoadsPage = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Layout user={user}>
      <OrdersWrapper />
    </Layout>
  );
};

export default LoadsPage;

export const getServerSideProps = withTranslationProps(
  withServerSideAuth([
    USER_ROLE.ADMIN,
    USER_ROLE.BOSS,
    USER_ROLE.VICE_BOSS,
    USER_ROLE.MARKETER,
    USER_ROLE.SATURATOR,
  ])(async (ctx) => {
    const { user } = ctx.session;

    return {
      props: {
        user,
      },
    };
  })
);
