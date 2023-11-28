import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  query Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      createdAt
      email
      name
      token
    }
  }
`;
