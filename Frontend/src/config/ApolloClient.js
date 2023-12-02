import React from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider as Provider,
} from "@apollo/client";

const client = new ApolloClient({
  uri: process.env.APP_URI,
  cache: new InMemoryCache(),
});

const ApolloProvider = (props) => {
  return <Provider client={client} {...props} />;
};

export default ApolloProvider;
