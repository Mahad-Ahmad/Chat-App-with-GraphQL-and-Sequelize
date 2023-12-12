import Header from "@/Components/Header";
import ApolloProvider from "@/config/ApolloClient";
import { GET_USER } from "@/GraphqlApi/Queries/Users";
import "@/styles/globals.css";
import { useQuery } from "@apollo/client";
import { RecoilRoot } from "recoil";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <ToastContainer />
      <ApolloProvider>
        <Header />
        <Component {...pageProps} />
      </ApolloProvider>
    </RecoilRoot>
  );
}
