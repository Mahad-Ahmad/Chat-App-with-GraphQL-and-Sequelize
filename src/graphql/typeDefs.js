const { gql } = require("apollo-server");

const typeDefs = gql`
  type User {
    name: String!
    email: String!
  }
  type Query {
    getUsers: [User]
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
