import { Layout } from "../../../components/Layout/Layout";
import { withServerSideAuth } from "../../../lib/server/middlewares/withServerSideAuth";
import { withTranslationProps } from "../../../lib/server/middlewares/withTranslationProps";
import { InferGetServerSidePropsType } from "next";
import { ClientCreate } from "../../../components/Orders/OrderCreateWrapper/OrderCreate/ClientCreate/ClientCreate";
import { USER_ROLE } from "../../../lib/types";

const CreateClientPage = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Layout user={user}>
      <ClientCreate />
    </Layout>
  );
};

export default CreateClientPage;

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
