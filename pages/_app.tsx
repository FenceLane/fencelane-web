import "../styles/globals.scss";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { appWithTranslation } from "next-i18next";

function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default appWithTranslation(App);
