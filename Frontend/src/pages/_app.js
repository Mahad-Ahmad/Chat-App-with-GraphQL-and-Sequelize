import ApolloProvider from "@/config/ApolloClient";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <ApolloProvider>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
