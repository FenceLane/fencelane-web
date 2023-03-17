import { Layout } from "../../../components/Layout/Layout";
import { withServerSideAuth } from "../../../lib/server/middlewares/withServerSideAuth";
import { withTranslationProps } from "../../../lib/server/middlewares/withTranslationProps";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { OrderDetailsWrapper } from "../../../components/Orders/OrderDetailsWrapper/OrderDetailsWrapper";

const OrderDetailsPage = ({
  user,
  orders,
}: InferGetServerSidePropsType<typeof getServerSideProps> & any) => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <Layout user={user}>
      <OrderDetailsWrapper id={id} />
    </Layout>
  );
};

export default OrderDetailsPage;

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
