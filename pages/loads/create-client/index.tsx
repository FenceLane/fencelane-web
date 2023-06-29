import { Layout } from "../../../components/Layout/Layout";
import { withServerSideAuth } from "../../../lib/server/middlewares/withServerSideAuth";
import { withTranslationProps } from "../../../lib/server/middlewares/withTranslationProps";
import { InferGetServerSidePropsType } from "next";
import { ClientCreate } from "../../../components/Loads/LoadCreateWrapper/LoadCreate/ClientCreate/ClientCreate";

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
  withServerSideAuth(async (ctx) => {
    const { user } = ctx.session;

    return {
      props: {
        user,
      },
    };
  })
);
