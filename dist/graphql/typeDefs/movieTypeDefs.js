"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.movieTypeDefs = void 0;
const apollo_server_express_1 = require("apollo-server-express");
exports.movieTypeDefs = (0, apollo_server_express_1.gql) `
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
//# sourceMappingURL=movieTypeDefs.js.map