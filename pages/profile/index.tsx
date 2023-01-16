import { Layout } from "../../components/Layout/Layout";
import { withServerSideAuth } from "../../lib/server/middlewares/withServerSideAuth";
import { withTranslationProps } from "../../lib/server/middlewares/withTranslationProps";
import { useContent } from "../../lib/hooks/useContent";
import { MyProfile } from "../../components/MyProfile/MyProfile";
import { InferGetServerSidePropsType } from "next";

const MyProfilePage = ({
  user,
  session,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useContent("pages.profile");
  return (
    <Layout user={user}>
      <MyProfile user={user} />
    </Layout>
  );
};

export default MyProfilePage;

export const getServerSideProps = withTranslationProps(
  withServerSideAuth(async (ctx) => {
    const { user, ...session } = ctx.session;
    const { id, createdAt, updatedAt, expiresAt } = session;
    return {
      props: {
        user,
        session: {
          id: id,
          createdAt: createdAt.getTime(),
          updatedAt: updatedAt.getTime(),
          expiresAt: expiresAt.getTime(),
        },
      },
    };
  })
);
