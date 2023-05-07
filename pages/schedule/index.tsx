import { Layout } from "../../components/Layout/Layout";
import { withServerSideAuth } from "../../lib/server/middlewares/withServerSideAuth";
import { withTranslationProps } from "../../lib/server/middlewares/withTranslationProps";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { InferGetServerSidePropsType } from "next";
import { EventsWrapper } from "../../components/Events/EventsWrapper/EventsWrapper";

const StoragePage = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Layout user={user}>
      <EventsWrapper />
    </Layout>
  );
};

export default StoragePage;

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
