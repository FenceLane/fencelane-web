import { Layout } from "../../../components/Layout/Layout";
import { withServerSideAuth } from "../../../lib/server/middlewares/withServerSideAuth";
import { withTranslationProps } from "../../../lib/server/middlewares/withTranslationProps";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { CalculationWrapper } from "../../../components/Calculations/CalculationWrapper/CalculationWrapper";
import { USER_ROLE } from "../../../lib/types";

const OrderDetailsPage = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { id } = router.query;

  if (typeof id !== "string") return null;

  return (
    <Layout user={user}>
      <CalculationWrapper orderId={Number(id)} />
    </Layout>
  );
};

export default OrderDetailsPage;

export const getServerSideProps = withTranslationProps(
  withServerSideAuth([USER_ROLE.ADMIN, USER_ROLE.BOSS, USER_ROLE.VICE_BOSS])(
    async (ctx) => {
      const { user } = ctx.session;

      return {
        props: {
          user,
        },
      };
    }
  )
);
