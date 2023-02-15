"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userTypeDefs = void 0;
const apollo_server_express_1 = require("apollo-server-express");
exports.userTypeDefs = (0, apollo_server_express_1.gql) `
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
//# sourceMappingURL=userTypeDefs.js.map