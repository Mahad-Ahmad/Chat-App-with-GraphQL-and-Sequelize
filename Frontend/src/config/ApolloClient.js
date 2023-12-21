import React from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider as Provider,
  createHttpLink,
  from,
  useQuery,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

const httpLink = createHttpLink({
  uri: process.env.APP_URI,
});

const authLink = setContext((_, { headers }) => {
  const windowObject = typeof window !== "undefined";
  const token = windowObject && JSON.parse(localStorage.getItem("token"));
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});

const client = new ApolloClient({
  // uri: process.env.APP_URI,
  // link: authLink.concat(httpLink),
  link: from([authLink, errorLink, httpLink]),
  cache: new InMemoryCache(),
});

const ApolloProvider = (props) => {
  return <Provider client={client} {...props} />;
};

export default ApolloProvider;
