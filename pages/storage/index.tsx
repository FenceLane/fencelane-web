import { Layout } from "../../components/Layout/Layout";
import { withServerSideAuth } from "../../lib/server/middlewares/withServerSideAuth";
import { withTranslationProps } from "../../lib/server/middlewares/withTranslationProps";
import { InferGetServerSidePropsType } from "next";
import { Storage } from "../../components/Storage/Storage";
import { apiClient } from "../../lib/api/apiClient";

interface CSTypes {
  id: React.Key;
  name: String;
  dimensions: String;
  volumePerPackage: Number;
  black: Number;
  white: Number;
  itemsPerPackage: Number;
  pieces: Number;
  stock: Number;
}
const StoragePage = ({
  user,
  products,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  let commodityStock: CSTypes[] = [];
  products.forEach((raw: any) => {
    raw.products.forEach((product: any) => {
      commodityStock.push({
        id: product.id,
        name: raw.name,
        dimensions: raw.dimensions,
        volumePerPackage: product.volumePerPackage,
        black: product.variant == "black" ? product.volumePerPackage : 0,
        white: product.variant == "white_wet" ? product.volumePerPackage : 0,
        itemsPerPackage: product.itemsPerPackage,
        pieces: product.itemsPerPackage * product.stock,
        stock: product.stock,
      });
    });
  });
  console.log(commodityStock);
  return (
    <Layout user={user}>
      <Storage commodityStock={commodityStock} />
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
