import "../styles/globals.scss";
import type { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/api/queryClient";

const theme = extendTheme({
  fonts: {
    heading: `'Poppins', sans-serif`,
    body: `'Poppins', sans-serif`,
  },
});

function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default appWithTranslation(App);
