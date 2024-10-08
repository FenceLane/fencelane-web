import { Layout } from "../../components/Layout/Layout";
import { StatsWrapper } from "../../components/Stats/StatsWrapper/StatsWrapper";
import { withServerSideAuth } from "../../lib/server/middlewares/withServerSideAuth";
import { withTranslationProps } from "../../lib/server/middlewares/withTranslationProps";
import { InferGetServerSidePropsType } from "next";
import { USER_ROLE } from "../../lib/types";
const StatsPage = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Layout user={user}>
      <StatsWrapper />
    </Layout>
  );
};

export default StatsPage;

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
