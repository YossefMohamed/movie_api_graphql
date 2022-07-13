import { gql } from "apollo-server-express";

export const userTypeDefs = gql`
  type User {
    id: String!
    name: String!
    email: String!
    image: String!
    updatedAt: String!
    verified: Boolean
    createdAt: String!
    favoriteMovies: [Movie]!
    savedMovies: [Movie]!
    deleted: Boolean!
    following: [String]!
  }
  type AuthPayload {
    token: String!
    user: User!
  }
  extend type Query {
    getUser(id: String!): User!
    login(email: String!, password: String!): AuthPayload!
    getFollowing(type: String): [User]
  }
  extend type Mutation {
    register(
      name: String!
      email: String!
      password: String!
      confirmPassword: String!
    ): AuthPayload!
    updateUser(
      name: String!
      email: String!
      oldPassword: String!
      password: String!
    ): AuthPayload!
    deleteUser: User!
    followUser(followingId: String!): User!
    unFollowUser(followingId: String!): User!
  }
`;
