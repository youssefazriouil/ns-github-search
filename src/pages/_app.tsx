import { Layout } from "@/components/Layout";
import { QueryHistoryContextProvider } from "@/providers/QueryHistoryContextProvider";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <QueryHistoryContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </QueryHistoryContextProvider>
    </QueryClientProvider>
  );
}
