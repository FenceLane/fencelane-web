import { Layout } from "../../../components/Layout/Layout";
import { withServerSideAuth } from "../../../lib/server/middlewares/withServerSideAuth";
import { withTranslationProps } from "../../../lib/server/middlewares/withTranslationProps";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { LoadDetailsWrapper } from "../../../components/Loads/LoadDetailsWrapper/LoadDetailsWrapper";

const LoadDetailsPage = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { id } = router.query;

  if (typeof id !== "string") return null;

  return (
    <Layout user={user}>
      <LoadDetailsWrapper id={Number(id)} />
    </Layout>
  );
};

export default LoadDetailsPage;

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
