import { Layout } from "../../components/Layout/Layout";
import { withServerSideAuth } from "../../lib/server/middlewares/withServerSideAuth";
import { withTranslationProps } from "../../lib/server/middlewares/withTranslationProps";
import { InferGetServerSidePropsType } from "next";
import { Storage } from "../../components/Storage/Storage";
import { apiClient } from "../../lib/api/apiClient";

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
  products,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  console.log(products);
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
  ];
  return (
    <Layout user={user}>
      <Storage commodityStock={commodityStock} />
      {/* console.log(stock) */}
    </Layout>
  );
};

export default StoragePage;

export const getServerSideProps = withTranslationProps(
  withServerSideAuth(async (ctx) => {
    const authCookie = ctx.req.headers.cookie as string;

    const { user } = ctx.session;
    const { data: products } = await apiClient.auth.getProducts({ authCookie });

    return {
      props: {
        user,
        products,
      },
    };
  })
);
