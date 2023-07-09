import { Layout } from "../../components/Layout/Layout";
import { withServerSideAuth } from "../../lib/server/middlewares/withServerSideAuth";
import { withTranslationProps } from "../../lib/server/middlewares/withTranslationProps";
import { InferGetServerSidePropsType } from "next";
import { StorageWrapper } from "../../components/Storage/StorageWrapper/StorageWrapper";
import { USER_ROLE } from "../../lib/types";

const StoragePage = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Layout user={user}>
      <StorageWrapper />
    </Layout>
  );
};

export default StoragePage;

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
