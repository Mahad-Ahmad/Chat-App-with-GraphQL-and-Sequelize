import { gql } from "@apollo/client";

export const GET_MESSAGES = gql`
  query GetMessages($from: String!, $offset: Int, $limit: Int) {
    getMessages(from: $from, offset: $offset, limit: $limit) {
      allMessages {
        content
        uuid
        to
        from
        createdAt
      }
      count
    }
  }
`;
