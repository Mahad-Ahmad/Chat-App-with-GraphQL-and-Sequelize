const { gql } = require("apollo-server");

const Message = gql`
  type Message {
    content: String!
    uuid: String!
    to: String!
    from: String!
  }
  type Query {
  }
  type Mutation {
    sendMessage(content: String!, to: String!): Message!
  }
`;

export default Message;
