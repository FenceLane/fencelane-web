import { CommissionCreateWrapper } from "../../../components/Commissions/CommissionsWrapper/Commissions/CommissionCreate/CommissionCreateWrapper/CommissionCreateWrapper";
import { Layout } from "../../../components/Layout/Layout";
import { withServerSideAuth } from "../../../lib/server/middlewares/withServerSideAuth";
import { withTranslationProps } from "../../../lib/server/middlewares/withTranslationProps";
import { InferGetServerSidePropsType } from "next";
import { USER_ROLE } from "../../../lib/types";

const CommissionCreatePage = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Layout user={user}>
      <CommissionCreateWrapper />
    </Layout>
  );
};

export default CommissionCreatePage;

export const getServerSideProps = withTranslationProps(
  withServerSideAuth([USER_ROLE.ADMIN])(async (ctx) => {
    const { user } = ctx.session;

    return {
      props: {
        user,
      },
    };
  })
);
