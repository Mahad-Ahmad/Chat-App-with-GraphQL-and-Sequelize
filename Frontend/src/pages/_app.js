import Header from "@/Components/Header";
import ApolloProvider from "@/config/ApolloClient";
import { RecoilRoot } from "recoil";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@/styles/globals.css";
import AuthLayout from "@/Components/AuthLayout";

export default function App({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <ToastContainer />
      <ApolloProvider>
        <AuthLayout>
          <Header />
          <Component {...pageProps} />
        </AuthLayout>
      </ApolloProvider>
    </RecoilRoot>
  );
}
