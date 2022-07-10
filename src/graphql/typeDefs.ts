/* eslint-disable */
import { gql } from "apollo-server-express";
export const typeDefs = gql`
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
  type PostComment {
    post: String
    id: String
    user: User
    content: String
    createdAt: String
    likes: [String]
  }
  type Post {
    id: String
    content: String
    user: User
    createdAt: String
    updatedAt: String
    tag: [String]
    likes: [String]
    comments: [PostComment]
  }
  type Movie {
    movieName: String!
    movieID: Int!
    movieImage: String
  }

  extend type Query {
    getUser(id: String!): User!
    login(email: String!, password: String!): AuthPayload!
    getFavoriteMovies: [Movie]!
    getSavedMovies: [Movie]!
    getMovieComments(movie: Int!): [Comment]!
    getAllPosts(tag: String!): [Post]
    getFollowing: [User]
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
    deleteUser: AuthPayload!
    addMovie(movieName: String!, movieID: Int!, movieImage: String!): User!
    addSavedMovie(movieName: String!, movieID: Int!, movieImage: String!): User!
    removeMovie(movieID: Int!): User
    removeSavedMovie(movieID: Int!): User
    addComment(movie: Int!, content: String!): Comment
    followUser(followingId: String!): User!
    unFollowUser(followingId: String!): User!
    addPost(content: String!, tag: [String]!): Post
    likePost(postId: String!): Post
    unLikePost(postId: String!): Post
    addCommentToPost(postId: String!, content: String!): Post
    likeComment(commentId: String!): PostComment
    unLikeComment(commentId: String!): PostComment
  }

  type Comment {
    content: String!
    user: User!
    movie: Int!
    createdAt: String!
  }
  type AuthPayload {
    token: String!
    user: User!
  }
`;
