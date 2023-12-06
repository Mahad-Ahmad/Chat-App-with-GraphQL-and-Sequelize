import Header from "@/Components/Header";
import ApolloProvider from "@/config/ApolloClient";
import { GET_USER } from "@/GraphqlApi/Queries/Users";
import "@/styles/globals.css";
import { useQuery } from "@apollo/client";
import { RecoilRoot } from "recoil";

export default function App({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <ApolloProvider>
        {/* <Header /> */}
        <Component {...pageProps} />
      </ApolloProvider>
    </RecoilRoot>
  );
}
