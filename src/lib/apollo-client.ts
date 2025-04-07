// lib/apollo-client.ts
import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
  credentials: "include",
});

const wsUrl = process.env.NEXT_PUBLIC_WS_BACKEND_BASE_URL;

if (!wsUrl) {
  throw new Error("WebSocket URL is not defined in env variables");
}

const wsLink = new GraphQLWsLink(createClient({ url: wsUrl }));

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink, // WebSocket for subscriptions
  httpLink // HTTP for queries/mutations
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client;
