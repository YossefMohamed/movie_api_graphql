"use strict";
/* eslint-disable */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postResolvers = void 0;
const getUserId_1 = require("../../helper/getUserId");
const post_1 = __importDefault(require("../../models/post"));
const postComment_1 = __importDefault(require("../../models/postComment"));
const user_1 = __importDefault(require("../../models/user"));
exports.postResolvers = {
    Query: {
        getAllPosts: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            let posts;
            const argSort = (_a = args.sort) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            console.log(argSort);
            const sort = `${argSort === "newest"
                ? "-createdAt"
                : argSort === "oldest"
                    ? "createdAt"
                    : argSort === "top"
                        ? "-likes"
                        : "createdAt"}`;
            console.log(posts, sort);
            if (args.tag.toLowerCase() === "all") {
                if (args.following) {
                    const userId = (0, getUserId_1.getUserId)(context.req);
                    if (!userId)
                        throw new Error("Please Login!");
                    const user = yield user_1.default.findById(userId);
                    posts = yield post_1.default.find({
                        $or: [{ user: { $in: user.following } }, { user: { $eq: userId } }],
                    })
                        .populate("user")
                        .populate("comments")
                        .populate({
                        path: "comments",
                        populate: {
                            path: "user",
                            model: "User",
                        },
                    })
                        .sort(`${sort}`);
                }
                else {
                    posts = yield post_1.default.find()
                        .populate("user")
                        .populate("comments")
                        .populate({
                        path: "comments",
                        populate: {
                            path: "user",
                            model: "User",
                        },
                    })
                        .sort(`${sort}`);
                }
            }
            else {
                if (args.following) {
                    const userId = (0, getUserId_1.getUserId)(context.req);
                    if (!userId)
                        throw new Error("Please Login!");
                    const user = yield user_1.default.findById(userId);
                    posts = yield post_1.default.find({
                        $and: [
                            { tag: args.tag },
                            {
                                $or: [
                                    { user: { $in: user.following } },
                                    { user: { $eq: userId } },
                                ],
                            },
                        ],
                    })
                        .populate("user")
                        .populate("comments")
                        .populate({
                        path: "comments",
                        populate: {
                            path: "user",
                            model: "User",
                        },
                    })
                        .sort(`${sort}`);
                }
                else {
                    posts = yield post_1.default.find({
                        tag: args.tag.toLowerCase(),
                    })
                        .populate("user")
                        .populate("comments")
                        .populate({
                        path: "comments",
                        populate: {
                            path: "user",
                            model: "User",
                        },
                    })
                        .sort(`${sort}`);
                }
            }
            console.log(posts);
            return posts;
        }),
    },
    Mutation: {
        addPost: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            const userId = (0, getUserId_1.getUserId)(context.req);
            if (!userId)
                throw new Error("Please Login!");
            const user = yield user_1.default.findById(userId);
            const post = yield post_1.default.create({
                user: userId,
                content: args.content,
                tag: args.tag,
            });
            const postDoc = yield post.populate("user");
            return postDoc;
        }),
        likePost: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            const userId = (0, getUserId_1.getUserId)(context.req);
            if (!userId)
                throw new Error("Please Login!");
            const post = yield post_1.default.findById(args.postId)
                .populate("user")
                .populate({
                path: "comments",
                populate: {
                    path: "user",
                    model: "User",
                },
            });
            if (post.likes.map((id) => `${id}` === `${userId}`).length) {
                return post;
            }
            post.likes.push(userId);
            yield post.save();
            return post;
        }),
        unLikePost: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            const userId = (0, getUserId_1.getUserId)(context.req);
            if (!userId)
                throw new Error("Please Login!");
            const post = yield post_1.default.findById(args.postId)
                .populate("user")
                .populate({
                path: "comments",
                populate: {
                    path: "user",
                    model: "User",
                },
            });
            if (!post.likes.map((id) => `${id}` === `${userId}`).length) {
                return post;
            }
            post.likes = post.likes.filter((id) => `${id}` !== `${userId}`);
            yield post.save();
            return post;
        }),
        addCommentToPost: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            const userId = (0, getUserId_1.getUserId)(context.req);
            if (!userId)
                throw new Error("Please Login!");
            const comment = yield postComment_1.default.create({
                user: userId,
                post: args.postId,
                content: args.content,
            });
            const post = yield post_1.default.findById(args.postId).populate("user");
            const postDoc = yield post.populate({
                path: "comments",
                populate: {
                    path: "user",
                    model: "User",
                },
            });
            return postDoc;
        }),
        likeComment: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            const userId = (0, getUserId_1.getUserId)(context.req);
            if (!userId)
                throw new Error("Please Login!");
            const comment = yield postComment_1.default.findById(args.commentId).populate("user");
            if (comment.likes.map((id) => `${id}` === `${userId}`).length) {
                return comment;
            }
            comment.likes.push(userId);
            yield comment.save();
            return comment;
        }),
        unLikeComment: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            const userId = (0, getUserId_1.getUserId)(context.req);
            if (!userId)
                throw new Error("Please Login!");
            const comment = yield postComment_1.default.findById(args.commentId).populate("user");
            if (!comment.likes.map((id) => `${id}` === `${userId}`).length) {
                return comment;
            }
            comment.likes = comment.likes.filter((id) => `${id}` !== `${userId}`);
            yield comment.save();
            return comment;
        }),
    },
};
//# sourceMappingURL=postResolvers.js.map