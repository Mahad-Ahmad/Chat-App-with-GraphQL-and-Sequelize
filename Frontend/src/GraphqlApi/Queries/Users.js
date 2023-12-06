import { gql } from "@apollo/client";

export const GET_USER = gql`
  query GetUser {
    getUser {
      email
      name
      token
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    getUsers {
      createdAt
      email
      name
      token
    }
  }
`;
