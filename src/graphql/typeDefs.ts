import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type User {
    id: String!
    name: String!
    email: String!
    image: String
    updatedAt: String!
    verified: Boolean
    createdAt: String!
  }
  extend type Query {
    getUsers: [User!]!
    login(email: String!, password: String!): AuthPayload!
  }
  extend type Mutation {
    updateUser(name: String, email: String, password: String): AuthPayload!
    register(
      name: String!
      email: String!
      password: String!
      confirmPassword: String!
    ): AuthPayload!
    updateUser(name: String, email: String, password: String): AuthPayload!
    deleteUser: AuthPayload!
  }
  type AuthPayload {
    token: String!
    user: User!
  }
`;
