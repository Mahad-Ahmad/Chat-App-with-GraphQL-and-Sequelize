const { gql } = require("apollo-server");

const typeDefs = gql`
  type User {
    name: String!
    email: String!
    token: String
    createdAt: String!
  }
  type Query {
    getUsers: [User]
    login(email: String!, password: String!): User!
  }
  type Mutation {
    register(
      name: String!
      email: String!
      password: String!
      confirmPassword: String!
    ): User!
  }
`;

export { typeDefs };
