import { gql } from "@apollo/client";

export const GET_USER = gql`
  query GetUser {
    getUser {
      email
      name
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    getUsers {
      createdAt
      name
      imageUrl
      email
      latestMessage {
        createdAt
        from
        to
        uuid
        content
      }
    }
  }
`;
