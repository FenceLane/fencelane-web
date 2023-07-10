import { Layout } from "../../../components/Layout/Layout";
import { withServerSideAuth } from "../../../lib/server/middlewares/withServerSideAuth";
import { withTranslationProps } from "../../../lib/server/middlewares/withTranslationProps";
import { InferGetServerSidePropsType } from "next";
import { OrderCreateWrapper } from "../../../components/Orders/OrderCreateWrapper/OrderCreateWrapper";
import { USER_ROLE } from "../../../lib/types";

const LoadCreatePage = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Layout user={user}>
      <OrderCreateWrapper />
    </Layout>
  );
};

export default LoadCreatePage;

export const getServerSideProps = withTranslationProps(
  withServerSideAuth([
    USER_ROLE.ADMIN,
    USER_ROLE.BOSS,
    USER_ROLE.VICE_BOSS,
    USER_ROLE.MARKETER,
  ])(async (ctx) => {
    const { user } = ctx.session;

    return {
      props: {
        user,
      },
    };
  })
);
