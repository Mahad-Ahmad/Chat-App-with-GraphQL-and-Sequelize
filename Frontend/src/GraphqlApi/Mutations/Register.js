import { gql } from "@apollo/client";

export const REGISTER_USER = gql`
  mutation register(
    $name: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      name: $name
      email: $email
      password: $password
      confirmPassword: $confirmPassword
    ) {
      email
      name
    }
  }
`;
