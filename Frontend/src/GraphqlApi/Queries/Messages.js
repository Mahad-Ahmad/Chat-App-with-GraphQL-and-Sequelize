import { gql } from "@apollo/client";

export const GET_MESSAGES = gql`
 query GetMessages($getMessagesFrom2: String!) {
  getMessages(from: $getMessagesFrom2) {
    content
    from
    createdAt
    to
    uuid
  }
}
`;

