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

  type Query {
    getMessages(from: String!, offset: Int, limit: Int): MessageList!
  }

  type Mutation {
    sendMessage(content: String!, to: String!): Message!
  }
  
  type Subscription {
    newMessage: Message!
  }
`;

export default Message;
