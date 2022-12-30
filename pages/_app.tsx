import "../styles/globals.scss";
import type { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/api/queryClient";
import { ToastContainer } from "react-toastify";
import { LoadingProvider } from "../lib/hooks/loadingContext";

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
        <LoadingProvider>
          <ToastContainer position="bottom-right" />
          <Component {...pageProps} />
        </LoadingProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default appWithTranslation(App);
