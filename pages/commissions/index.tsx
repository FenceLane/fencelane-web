import { CommissionsWrapper } from "../../components/Commissions/CommissionsWrapper/CommissionsWrapper";
import { Layout } from "../../components/Layout/Layout";
import { withServerSideAuth } from "../../lib/server/middlewares/withServerSideAuth";
import { withTranslationProps } from "../../lib/server/middlewares/withTranslationProps";
import { InferGetServerSidePropsType } from "next";
import { USER_ROLE } from "../../lib/types";

const CommissionsPage = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Layout user={user}>
      <CommissionsWrapper />
    </Layout>
  );
};

export default CommissionsPage;

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
