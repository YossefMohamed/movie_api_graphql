/* eslint-disable */
import { gql } from "apollo-server-express";
export const commentTypeDefs = gql`
  type PostComment {
    post: String
    id: String
    user: User
    content: String
    createdAt: String
    likes: [String]
  }
  extend type Mutation {
    addCommentToPost(postId: String!, content: String!): Post
    likeComment(commentId: String!): PostComment
    unLikeComment(commentId: String!): PostComment
  }
`;
