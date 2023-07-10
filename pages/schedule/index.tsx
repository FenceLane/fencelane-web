import { Layout } from "../../components/Layout/Layout";
import { withServerSideAuth } from "../../lib/server/middlewares/withServerSideAuth";
import { withTranslationProps } from "../../lib/server/middlewares/withTranslationProps";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { InferGetServerSidePropsType } from "next";
import { EventsWrapper } from "../../components/Events/EventsWrapper/EventsWrapper";
import { USER_ROLE } from "../../lib/types";

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
  withServerSideAuth([
    USER_ROLE.ADMIN,
    USER_ROLE.BOSS,
    USER_ROLE.VICE_BOSS,
    USER_ROLE.MARKETER,
    USER_ROLE.SATURATOR,
  ])(async (ctx) => {
    const { user } = ctx.session;

    return {
      props: {
        user,
      },
    };
  })
);
