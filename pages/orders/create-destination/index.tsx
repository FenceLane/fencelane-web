import { Layout } from "../../../components/Layout/Layout";
import { withServerSideAuth } from "../../../lib/server/middlewares/withServerSideAuth";
import { withTranslationProps } from "../../../lib/server/middlewares/withTranslationProps";
import { InferGetServerSidePropsType } from "next";
import { DestinationCreateWrapper } from "../../../components/Orders/OrderCreateWrapper/OrderCreate/DestinationCreateWrapper/DestinationCreateWrapper";

const CreateDestinationPage = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps> & any) => {
  return (
    <Layout user={user}>
      <DestinationCreateWrapper />
    </Layout>
  );
};

export default CreateDestinationPage;

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
