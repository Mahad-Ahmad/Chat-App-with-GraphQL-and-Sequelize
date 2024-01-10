const { gql } = require("apollo-server");

const Message = gql`
  type Message {
    content: String!
    uuid: String!
    to: String!
    from: String!
    createdAt: String!
  }

  type Query {
    getMessages(from: String!): [Message]!
  }
  type Mutation {
    sendMessage(content: String!, to: String!): Message!
  }
  type Subscription {
    newMessage: Message!
  }
`;

export default Message;
