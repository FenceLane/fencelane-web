import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { SSRConfig } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

type PropsResult<P> = GetServerSidePropsResult<P> & SSRConfig;

export const withTranslationProps =
  <C extends GetServerSidePropsContext, P>(
    handler: (context: C) => Promise<PropsResult<P>> | PropsResult<P>
  ) =>
  async (ctx: C) => {
    const localeProps = ctx.locale
      ? await serverSideTranslations(ctx.locale, ["common"])
      : undefined;

    const handlerResult = await handler(ctx as C);
    const handlerResultProps = "props" in handlerResult && handlerResult.props;

    const resultWithTranslations = {
      ...handlerResult,
      props: { ...localeProps, ...handlerResultProps },
    } as PropsResult<P>;

    return resultWithTranslations;
  };
