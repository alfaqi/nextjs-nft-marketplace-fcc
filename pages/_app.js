import Header from "@/components/Header";
import "@/styles/globals.css";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import Head from "next/head";
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "web3uikit";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "https://api.studio.thegraph.com/query/48083/nft-marketplace/version/latest",
});

export default function App({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>NFT Marketplace</title>
        <meta name="description" content="" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </Head>
      <MoralisProvider initializeOnMount={false}>
        <ApolloProvider client={client}>
          <NotificationProvider>
            <Header />
            <Component {...pageProps} />
          </NotificationProvider>
        </ApolloProvider>
      </MoralisProvider>
    </div>
  );
}
