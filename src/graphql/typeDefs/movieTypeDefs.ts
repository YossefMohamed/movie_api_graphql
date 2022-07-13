import { gql } from "apollo-server-express";

export const movieTypeDefs = gql`
  type Movie {
    movieName: String!
    movieID: Int!
    movieImage: String
  }

  extend type Query {
    getFavoriteMovies: [Movie]!
    getSavedMovies: [Movie]!
    getMovieComments(movie: Int!): [Comment]!
  }

  extend type Mutation {
    addMovie(movieName: String!, movieID: Int!, movieImage: String!): User!
    addSavedMovie(movieName: String!, movieID: Int!, movieImage: String!): User!
    removeMovie(movieID: Int!): User
    removeSavedMovie(movieID: Int!): User
  }
`;
