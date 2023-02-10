import { Layout } from "../../components/Layout/Layout";
import { withServerSideAuth } from "../../lib/server/middlewares/withServerSideAuth";
import { withTranslationProps } from "../../lib/server/middlewares/withTranslationProps";
import { InferGetServerSidePropsType } from "next";
import { Storage } from "../../components/Storage/Storage";

interface CSTypes {
  id: React.Key;
  commodity: String;
  dimensions: String;
  m3Quantity: Number;
  black: Number;
  white: Number;
  package: Number;
  piecesQuantity: Number;
  packagesQuantity: Number;
}
const StoragePage = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const commodityStock: CSTypes[] = [
    {
      id: 1,
      commodity: "Palisada okorowana",
      dimensions: "75 - 100 x 1650",
      m3Quantity: 21.714,
      black: 21.714,
      white: 0,
      package: 105,
      piecesQuantity: 2310,
      packagesQuantity: 22,
    },
    {
      id: 2,
      commodity: "Palisada cylindryczna",
      dimensions: "75 - 100 x 1650",
      m3Quantity: 21.714,
      black: 21.714,
      white: 0,
      package: 105,
      piecesQuantity: 2310,
      packagesQuantity: 22,
    },
    {
      id: 3,
      commodity: "Palisada prostokątna",
      dimensions: "75 - 100 x 1650",
      m3Quantity: 21.714,
      black: 21.714,
      white: 0,
      package: 105,
      piecesQuantity: 2310,
      packagesQuantity: 22,
    },
    {
      id: 4,
      commodity: "Słupek bramowy",
      dimensions: "75 - 100 x 1650",
      m3Quantity: 21.714,
      black: 21.714,
      white: 0,
      package: 105,
      piecesQuantity: 2310,
      packagesQuantity: 22,
    },
    {
      id: 5,
      commodity: "Palisada okorowana",
      dimensions: "75 - 100 x 1650",
      m3Quantity: 21.714,
      black: 21.714,
      white: 0,
      package: 105,
      piecesQuantity: 2310,
      packagesQuantity: 22,
    },
    {
      id: 7,
      commodity: "Palisada okorowana",
      dimensions: "75 - 100 x 1650",
      m3Quantity: 21.714,
      black: 21.714,
      white: 0,
      package: 105,
      piecesQuantity: 2310,
      packagesQuantity: 22,
    },
    {
      id: 11,
      commodity: "Palisada okorowana",
      dimensions: "75 - 100 x 1650",
      m3Quantity: 21.714,
      black: 21.714,
      white: 0,
      package: 105,
      piecesQuantity: 2310,
      packagesQuantity: 22,
    },
    {
      id: 12,
      commodity: "Palisada cylindryczna",
      dimensions: "75 - 100 x 1650",
      m3Quantity: 21.714,
      black: 21.714,
      white: 0,
      package: 105,
      piecesQuantity: 2310,
      packagesQuantity: 22,
    },
    {
      id: 13,
      commodity: "Palisada prostokątna",
      dimensions: "75 - 100 x 1650",
      m3Quantity: 21.714,
      black: 21.714,
      white: 0,
      package: 105,
      piecesQuantity: 2310,
      packagesQuantity: 22,
    },
    {
      id: 14,
      commodity: "Słupek bramowy",
      dimensions: "75 - 100 x 1650",
      m3Quantity: 21.714,
      black: 21.714,
      white: 0,
      package: 105,
      piecesQuantity: 2310,
      packagesQuantity: 22,
    },
    {
      id: 15,
      commodity: "Palisada okorowana",
      dimensions: "75 - 100 x 1650",
      m3Quantity: 21.714,
      black: 21.714,
      white: 0,
      package: 105,
      piecesQuantity: 2310,
      packagesQuantity: 22,
    },
    {
      id: 17,
      commodity: "Palisada okorowana",
      dimensions: "75 - 100 x 1650",
      m3Quantity: 21.714,
      black: 21.714,
      white: 0,
      package: 105,
      piecesQuantity: 2310,
      packagesQuantity: 22,
    },
    {
      id: 21,
      commodity: "Palisada okorowana",
      dimensions: "75 - 100 x 1650",
      m3Quantity: 21.714,
      black: 21.714,
      white: 0,
      package: 105,
      piecesQuantity: 2310,
      packagesQuantity: 22,
    },
    {
      id: 22,
      commodity: "Palisada cylindryczna",
      dimensions: "75 - 100 x 1650",
      m3Quantity: 21.714,
      black: 21.714,
      white: 0,
      package: 105,
      piecesQuantity: 2310,
      packagesQuantity: 22,
    },
    {
      id: 23,
      commodity: "Palisada prostokątna",
      dimensions: "75 - 100 x 1650",
      m3Quantity: 21.714,
      black: 21.714,
      white: 0,
      package: 105,
      piecesQuantity: 2310,
      packagesQuantity: 22,
    },
    {
      id: 24,
      commodity: "Słupek bramowy",
      dimensions: "75 - 100 x 1650",
      m3Quantity: 21.714,
      black: 21.714,
      white: 0,
      package: 105,
      piecesQuantity: 2310,
      packagesQuantity: 22,
    },
    {
      id: 25,
      commodity: "Palisada okorowana",
      dimensions: "75 - 100 x 1650",
      m3Quantity: 21.714,
      black: 21.714,
      white: 0,
      package: 105,
      piecesQuantity: 2310,
      packagesQuantity: 22,
    },
    {
      id: 27,
      commodity: "Palisada okorowana",
      dimensions: "75 - 100 x 1650",
      m3Quantity: 21.714,
      black: 21.714,
      white: 0,
      package: 105,
      piecesQuantity: 2310,
      packagesQuantity: 22,
    },
  ];
  return (
    <Layout user={user}>
      <Storage commodityStock={commodityStock} />
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
