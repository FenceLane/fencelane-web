import "../styles/globals.scss";
import type { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/api/queryClient";
import { ToastContainer } from "react-toastify";
import { LoadingProvider } from "../lib/hooks/loadingContext";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { UserInfo } from "../lib/types";
import { useReactQueryWebsocketSocketSubscription } from "../lib/hooks/useReactQuerySubscription";

const theme = extendTheme({
  fonts: {
    heading: `'Poppins', sans-serif`,
    body: `'Poppins', sans-serif`,
  },
});

function App({ Component, pageProps }: AppProps<{ user?: UserInfo }>) {
  const userId = pageProps.user?.id;
  useReactQueryWebsocketSocketSubscription(userId);

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
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
