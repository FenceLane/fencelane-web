import { Layout } from "../../components/Layout/Layout";
import { withServerSideAuth } from "../../lib/server/middlewares/withServerSideAuth";
import { withTranslationProps } from "../../lib/server/middlewares/withTranslationProps";
import { InferGetServerSidePropsType } from "next";
import { USER_ROLE } from "../../lib/types";
import { AdminPanelWrapper } from "../../components/AdminPanel/AdminPanelWrapper/AdminPanelWrapper";

const AdminPage = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Layout user={user}>
      <AdminPanelWrapper />
    </Layout>
  );
};

export default AdminPage;

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
