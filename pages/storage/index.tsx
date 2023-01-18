import { Layout } from "../../components/Layout/Layout";
import { withServerSideAuth } from "../../lib/server/middlewares/withServerSideAuth";
import { withTranslationProps } from "../../lib/server/middlewares/withTranslationProps";
import { useContent } from "../../lib/hooks/useContent";
import { InferGetServerSidePropsType } from "next";
import { Storage } from "../../components/Storage/Storage";

const StoragePage = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useContent("pages.storage");
  return (
    <Layout user={user}>
      <Storage />
    </Layout>
  );
};

export default StoragePage;

export const getServerSideProps = withTranslationProps(
  withServerSideAuth(async (ctx) => {
    const { user, ...session } = ctx.session;
    return {
      props: {
        user,
      },
    };
  })
);
