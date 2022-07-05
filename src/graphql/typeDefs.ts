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
    savedMovies: [Movie]!
  }
  type Movie {
    movieName: String!
    movieID: Int!
    movieImage : String
  }

  extend type Query {
    getUser(id:String!): User!
    login(email: String!, password: String!): AuthPayload!
    getFavoriteMovies:[Movie]!
    getSavedMovies:[Movie]!
    getMovieComments(movie:Int!):[Comment]!

  }
  extend type Mutation {
    register(
      name: String!
      email: String!
      password: String!
      confirmPassword: String!
    ): AuthPayload!
    updateUser(name: String!, email: String!,oldPassword: String!,password: String!): AuthPayload!
    deleteUser: AuthPayload!
    addMovie(movieName: String!, movieID: Int! , movieImage : String!): User!
    addSavedMovie(movieName: String!, movieID: Int! , movieImage : String!): User!
    removeMovie(movieID: Int!): User
    removeSavedMovie(movieID: Int!): User
    addComment(movie: Int!,content:String!): Comment
  }

  type Comment  {
    content: String!
    user : User!
    movie : Int!
    createdAt: String!
  }
  type AuthPayload {
    token: String!
    user: User!
  }
`;
