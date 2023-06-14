import { Layout } from "../../components/Layout/Layout";
import { StatsWrapper } from "../../components/Stats/StatsWrapper/StatsWrapper";
import { withServerSideAuth } from "../../lib/server/middlewares/withServerSideAuth";
import { withTranslationProps } from "../../lib/server/middlewares/withTranslationProps";
import { InferGetServerSidePropsType } from "next";
import dynamic from "next/dynamic";

const DonutChartCard = dynamic(
  () => import("../../components/Stats/Charts/DonutChartCard/DonutChartCard"),
  { ssr: false }
);
const BarChart = dynamic(
  () => import("../../components/Stats/Charts/BarChart/BarChart"),
  { ssr: false }
);

const StatsPage = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Layout user={user}>
      <StatsWrapper />
    </Layout>
  );
};

export default StatsPage;

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
