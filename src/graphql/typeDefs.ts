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
    favoriteMovies: [Movie]!
  }
  type Movie {
    movieName: String!
    movieID: Int!
    movieImage : String!
  }

  extend type Query {
    getUsers: [User!]!
    login(email: String!, password: String!): AuthPayload!
    getFavoriteMovies:[Movie]!
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
    addMovie(movieName: String!, movieID: Int! , movieImage : String!): User!
    removeMovie(movieID: Int!): User
    
  }
  type AuthPayload {
    token: String!
    user: User!
  }
`;
