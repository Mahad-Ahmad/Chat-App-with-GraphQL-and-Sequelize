import React from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider as Provider,
  createHttpLink,
  from,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

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

const wsLink = new GraphQLWsLink(
  createClient({
    url: process.env.SUBSCRIPTION_URL,
    operation: {
      reconnect: true,
    },
    connectionParams: {
      Authorization: `Bearer ${
        typeof window !== "undefined" &&
        JSON.parse(localStorage.getItem("token"))
      }`,
    },
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  from([authLink, errorLink, httpLink])
);

const client = new ApolloClient({
  // uri: process.env.APP_URI,
  // link: authLink.concat(httpLink),
  link: splitLink,
  cache: new InMemoryCache(),
});

const ApolloProvider = (props) => {
  return <Provider client={client} {...props} />;
};

export default ApolloProvider;
