import { Layout } from "../../components/Layout/Layout";
import { Box, Text } from "@chakra-ui/react";
import { withServerSideAuth } from "../../lib/server/middlewares/withServerSideAuth";
import { withTranslationProps } from "../../lib/server/middlewares/withTranslationProps";
import { InferGetServerSidePropsType } from "next";
import { productTypesInfo } from "../../components/Stats/Constants";
import dynamic from "next/dynamic";
import ProductTypes from "../../components/Stats/Charts/ProductsTypes/ProductTypes";
import { ChevronDownIcon } from "@chakra-ui/icons";

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
      <Box width={"100%"}>
        <Box
          fontSize={"20px"}
          display={"inline-flex"}
          flex={"row"}
          alignItems="center"
          gap={2}
          pl={2}
          pt={1}
        >
          <Text fontWeight={500} color={"#333333"}>
            Przegląd
          </Text>
          <Text cursor={"pointer"} fontWeight={"600"}>
            marca
            <ChevronDownIcon />
          </Text>{" "}
          {/* add actuall month with select input*/}
        </Box>
        <Box mt={4} display="flex" flexWrap="wrap" gap={4}>
          <DonutChartCard
            title={"Ilość zrealizowanych zamówień"}
            value={13} // count the number of completed orders in the current month
            series={[25, 75]}
            colors={["#f75943", "#EBEBEB"]}
            unit={undefined}
          />
          <DonutChartCard
            title={"Średni zysk z zamówienia"}
            value={1123.76} // calculate the average profit in the current month
            series={[75, 25]}
            colors={["#27c088", "#EBEBEB"]}
            unit={"€"}
          />
          <DonutChartCard
            title={"Ilość klientów"}
            value={5} // count the number of customers who received the order in the current month
            series={[33, 66]}
            colors={["#c37baf", "#EBEBEB"]}
            unit={undefined}
          />
          <DonutChartCard
            title={"Objętość sprzedanego towaru"}
            value={32124} // add sold palisades in the current month
            series={[66, 33]}
            colors={["#afe0f4", "#EBEBEB"]}
            unit={"m³"}
          />
        </Box>
        <Box mt={3} borderRadius={4} display={["block", "flex"]} gap={4}>
          <BarChart />
          <Box bgColor={"#fcfcfc"} borderRadius={"10px"} p={6}>
            {productTypesInfo.map((bar) => (
              <ProductTypes key={bar.title} {...bar} />
            ))}
          </Box>
        </Box>
      </Box>
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