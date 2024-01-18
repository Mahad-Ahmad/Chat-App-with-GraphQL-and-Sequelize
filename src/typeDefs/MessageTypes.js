const { gql } = require("apollo-server");

const Message = gql`
  type Message {
    content: String!
    uuid: String!
    to: String!
    from: String!
    createdAt: String!
  }

  type MessageList {
    allMessages: [Message]!
    count: Int!
  }

  type Reaction {
    content: String!
    uuid: String!
    Message: Message!
    User: User!
    createdAt: String!
  }

  type Query {
    getMessages(from: String!, offset: Int, limit: Int): MessageList!
  }

  type Mutation {
    sendMessage(content: String!, to: String!): Message!
    reactToMessage(content: String!, uuid: String!): Reaction!
  }

  type Subscription {
    newMessage: Message!
    newReaction: Reaction!
  }
`;

export default Message;
