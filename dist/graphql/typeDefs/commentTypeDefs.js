"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentTypeDefs = void 0;
const apollo_server_express_1 = require("apollo-server-express");
exports.commentTypeDefs = (0, apollo_server_express_1.gql) `
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
//# sourceMappingURL=commentTypeDefs.js.map