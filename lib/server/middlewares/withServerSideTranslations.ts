import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  GetStaticPropsContext,
} from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const withServerSideTranslations =
  <C extends GetServerSidePropsContext, P>(
    handler: (
      context: C
    ) => Promise<GetServerSidePropsResult<P>> | GetServerSidePropsResult<P>
  ) =>
  async (ctx: GetStaticPropsContext) => {
    const localeProps = ctx.locale
      ? await serverSideTranslations(ctx.locale, ["common"])
      : undefined;

    const handlerResult = await handler(ctx as C);
    const handlerResultProps = "props" in handlerResult && handlerResult.props;

    const resultWithTranslations = {
      ...handlerResult,
      props: { ...localeProps, ...handlerResultProps },
    };

    return resultWithTranslations;
  };
