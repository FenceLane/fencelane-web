import { Layout } from "../../components/Layout/Layout";
import { withServerSideAuth } from "../../lib/server/middlewares/withServerSideAuth";
import { withTranslationProps } from "../../lib/server/middlewares/withTranslationProps";
import { InferGetServerSidePropsType } from "next";
import { EmployeesWrapper } from "../../components/Employees/EmployeesWrapper/EmployeesWrapper";
import { USER_ROLE } from "../../lib/types";

const EmployeesPage = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Layout user={user}>
      <EmployeesWrapper />
    </Layout>
  );
};

export default EmployeesPage;

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
