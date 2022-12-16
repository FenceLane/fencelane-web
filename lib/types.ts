export type InferPagePropsType<T> = T extends (
  ...args: readonly any[]
) => Promise<{ readonly props: infer P } | { readonly notFound: boolean }>
  ? NonNullable<P>
  : never;
