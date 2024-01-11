import { gql } from "@apollo/client";

export const NEW_MESSAGE_SUBSCRIPTION = gql`
  subscription NewMessage {
    newMessage {
      content
      uuid
      to
      from
      createdAt
    }
  }
`;
