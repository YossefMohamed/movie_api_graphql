"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const userResolvers_1 = require("./userResolvers");
const movieResolvers_1 = require("./movieResolvers");
const commentResolvers_1 = require("./commentResolvers");
const postResolvers_1 = require("./postResolvers");
exports.resolvers = {
    Query: Object.assign(Object.assign(Object.assign(Object.assign({}, userResolvers_1.userResolvers.Query), movieResolvers_1.movieResolvers.Query), commentResolvers_1.commentResolvers.Query), postResolvers_1.postResolvers.Query),
    Mutation: Object.assign(Object.assign(Object.assign(Object.assign({}, userResolvers_1.userResolvers.Mutation), movieResolvers_1.movieResolvers.Mutation), commentResolvers_1.commentResolvers.Mutation), postResolvers_1.postResolvers.Mutation),
};
//# sourceMappingURL=index.js.map