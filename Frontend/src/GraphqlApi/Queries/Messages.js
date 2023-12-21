import { gql } from "@apollo/client";

export const GET_MESSAGES = gql`
  query GetUser {
    getUser {
      email
      name
    }
  }
`;

