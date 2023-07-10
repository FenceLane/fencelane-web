import { CalculationsWrapper } from "../../components/Calculations/CalculationsWrapper/CalculationsWrapper";
import { Layout } from "../../components/Layout/Layout";
import { withServerSideAuth } from "../../lib/server/middlewares/withServerSideAuth";
import { withTranslationProps } from "../../lib/server/middlewares/withTranslationProps";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { USER_ROLE } from "../../lib/types";

const CalculationsPage = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  return (
    <Layout user={user}>
      <CalculationsWrapper></CalculationsWrapper>
    </Layout>
  );
};

export default CalculationsPage;

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
