"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postTypeDefs = void 0;
const apollo_server_express_1 = require("apollo-server-express");
exports.postTypeDefs = (0, apollo_server_express_1.gql) `
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
//# sourceMappingURL=postTypeDefs.js.map