import { gql } from "@apollo/client";

export const GET_MESSAGES = gql`
  query GetMessages($from: String!) {
    getMessages(from: $from) {
      content
      createdAt
      from
      to
      uuid
    }
  }
`;
