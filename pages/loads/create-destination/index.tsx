import { Layout } from "../../../components/Layout/Layout";
import { withServerSideAuth } from "../../../lib/server/middlewares/withServerSideAuth";
import { withTranslationProps } from "../../../lib/server/middlewares/withTranslationProps";
import { InferGetServerSidePropsType } from "next";
import { DestinationCreateWrapper } from "../../../components/Orders/OrderCreateWrapper/OrderCreate/DestinationCreateWrapper/DestinationCreateWrapper";
import { USER_ROLE } from "../../../lib/types";

const CreateDestinationPage = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Layout user={user}>
      <DestinationCreateWrapper />
    </Layout>
  );
};

export default CreateDestinationPage;

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
