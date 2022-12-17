import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

type PropsContext = GetServerSidePropsContext | GetStaticPropsContext;
type PropsResult<P> = GetServerSidePropsResult<P> | GetStaticPropsResult<P>;

export const withTranslationProps =
  <C extends PropsContext, P>(
    handler: (context: C) => Promise<PropsResult<P>> | PropsResult<P>
  ) =>
  async (ctx: PropsContext) => {
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
