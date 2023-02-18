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
  return (
    <Layout user={user}>
      <Storage products={products} />
    </Layout>
  );
};

export default StoragePage;

export const getServerSideProps = withTranslationProps(
  withServerSideAuth(async (ctx) => {
    const authCookie = ctx.req.headers.cookie as string;

    const { user } = ctx.session;
    const products = await apiClient.products.getProducts({
      authCookie,
    });

    return {
      props: {
        user,
        products,
      },
    };
  })
);
