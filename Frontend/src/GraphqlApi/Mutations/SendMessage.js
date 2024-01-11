import { gql } from "@apollo/client";

export const SEND_MESSAGES = gql`
  mutation SendMessage($content: String!, $to: String!) {
    sendMessage(content: $content, to: $to) {
      content
      createdAt
      from
      to
      uuid
    }
  }
`;
