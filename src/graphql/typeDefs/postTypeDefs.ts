import { gql } from "apollo-server-express";

export const postTypeDefs = gql`
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
  type Comment {
    content: String!
    user: User!
    movie: Int!
    createdAt: String!
  }
  extend type Query {
    getAllPosts(tag: String!, following: Boolean, sort: String): [Post]
  }

  extend type Mutation {
    addComment(movie: Int!, content: String!): Comment
    addPost(content: String!, tag: [String]!): Post
    likePost(postId: String!): Post
    unLikePost(postId: String!): Post
  }
`;
