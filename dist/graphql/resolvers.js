"use strict";
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
exports.resolvers = void 0;
const generateToken_1 = require("../helper/generateToken");
const getUserId_1 = require("../helper/getUserId");
const comment_1 = __importDefault(require("../models/comment"));
const post_1 = __importDefault(require("../models/post"));
const postComment_1 = __importDefault(require("../models/postComment"));
const user_1 = __importDefault(require("../models/user"));
exports.resolvers = {
    Query: {
        getUser: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield user_1.default.findById(args.id);
            return user;
        }),
        login: (parant, args) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { email, password } = args;
                const user = yield user_1.default.findOne({
                    email,
                }).select("+password +favoriteMovies");
                if (!user)
                    throw new Error("Email or Password Are Incorrect");
                const checkPassword = yield user.correctPassword(password, user.password);
                if (!checkPassword || !user)
                    throw new Error("Email or Password Are Incorrect");
                const token = (0, generateToken_1.generateToken)(user.id);
                return { user, token };
            }
            catch (e) {
                throw new Error(e.message);
            }
        }),
        getFavoriteMovies: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const userId = (0, getUserId_1.getUserId)(context.req);
                if (!userId)
                    throw new Error("Please Login!");
                const user = yield user_1.default.findById(userId);
                return user.favoriteMovies;
            }
            catch (error) {
                throw new Error(error.message);
            }
        }),
        getSavedMovies: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const userId = (0, getUserId_1.getUserId)(context.req);
                if (!userId)
                    throw new Error("Please Login!");
                const user = yield user_1.default.findById(userId);
                return user.savedMovies;
            }
            catch (error) {
                throw new Error(error.message);
            }
        }),
        getMovieComments: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const comments = yield comment_1.default.find({
                movie: args.movie,
            }).populate("user");
            return comments;
        }),
        getAllPosts: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            let posts;
            const argSort = (_a = args.sort) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            const sort = `${argSort === "newest"
                ? "-createdAt"
                : argSort === "oldest"
                    ? "createdAt"
                    : argSort === "top"
                        ? "-likes"
                        : "createdAt"}`;
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
            return posts;
        }),
        getFollowing: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const userId = (0, getUserId_1.getUserId)(context.req);
                if (!userId)
                    throw new Error("Please Login!");
                const type = args.type;
                if (type === "following") {
                    const user = yield user_1.default.findById(userId).populate("following");
                    return user.following;
                }
                if (type === "followers") {
                    const users = yield user_1.default.find({ following: { $in: [userId] } });
                    return users;
                }
                return [];
            }
            catch (error) {
                throw new Error(error.message);
            }
        }),
    },
    Mutation: {
        register: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const user = new user_1.default(args);
            const token = (0, generateToken_1.generateToken)(user.id);
            yield user.save();
            return { token, user };
        }),
        updateUser: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            const userId = (0, getUserId_1.getUserId)(context.req);
            if (!userId)
                throw new Error("Please Login!");
            const user = yield user_1.default.findById(userId);
            if (!user)
                throw new Error("User not found");
            user.email = args.email || user.email;
            user.name = args.name || user.name;
            if (args.oldPassword && args.password) {
                const checkPassword = yield user.correctPassword(args.oldPassword, user.password);
                if (!checkPassword)
                    throw new Error("Email or Password Are Incorrect");
                user.password = args.password;
            }
            yield user.save();
            return {
                user,
                token: context.req.headers.authorization.split(" ")[1],
            };
        }),
        deleteUser: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            const userId = (0, getUserId_1.getUserId)(context.req);
            if (!userId)
                throw new Error("Please Login!");
            const user = yield user_1.default.findById(userId);
            if (!user)
                throw new Error("User not found");
            const deletedUser = yield user_1.default.findByIdAndDelete(userId);
            return deletedUser;
        }),
        addMovie: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            const userId = (0, getUserId_1.getUserId)(context.req);
            if (!userId)
                throw new Error("Please Login!");
            const user = yield user_1.default.findById(userId);
            if (user.favoriteMovies.filter((movie) => movie.movieID == args.movieID)
                .length)
                throw new Error("Movie already exists");
            user.favoriteMovies = [
                ...user.favoriteMovies,
                {
                    movieID: args.movieID,
                    movieName: args.movieName,
                    movieImage: args.movieImage,
                },
            ];
            yield user.save();
            return user;
        }),
        addSavedMovie: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            const userId = (0, getUserId_1.getUserId)(context.req);
            if (!userId)
                throw new Error("Please Login!");
            const user = yield user_1.default.findById(userId);
            if (user.savedMovies.filter((movie) => movie.movieID == args.movieID).length)
                throw new Error("Movie already exists");
            user.savedMovies = [
                ...user.savedMovies,
                {
                    movieID: args.movieID,
                    movieName: args.movieName,
                    movieImage: args.movieImage,
                },
            ];
            yield user.save();
            return user;
        }),
        removeMovie: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            const userId = (0, getUserId_1.getUserId)(context.req);
            if (!userId)
                throw new Error("Please Login!");
            const user = yield user_1.default.findById(userId);
            user.favoriteMovies = user.favoriteMovies.filter((movie) => movie.movieID !== args.movieID);
            yield user.save();
            return user;
        }),
        removeSavedMovie: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            const userId = (0, getUserId_1.getUserId)(context.req);
            if (!userId)
                throw new Error("Please Login!");
            const user = yield user_1.default.findById(userId);
            user.savedMovies = user.savedMovies.filter((movie) => movie.movieID !== args.movieID);
            yield user.save();
            return user;
        }),
        addComment: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            const userId = (0, getUserId_1.getUserId)(context.req);
            if (!userId)
                throw new Error("Please Login!");
            const user = yield user_1.default.findById(userId);
            const comment = yield comment_1.default.create({
                user: userId,
                movie: args.movie,
                content: args.content,
            });
            const commentDoc = yield comment.populate("user");
            return commentDoc;
        }),
        followUser: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            const userId = (0, getUserId_1.getUserId)(context.req);
            if (!userId)
                throw new Error("Please Login!");
            const user = yield user_1.default.findById(userId);
            if (user.following.find((id) => `${id}` === `${args.followingId}`)) {
                return user;
            }
            else {
                user.following.push(args.followingId);
                user.save();
                return user;
            }
        }),
        unFollowUser: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            const userId = (0, getUserId_1.getUserId)(context.req);
            if (!userId)
                throw new Error("Please Login!");
            const user = yield user_1.default.findById(userId);
            if (user.following.map((id) => `${id}` === `${args.followingId}`).length) {
                user.following = user.following.filter((user) => `${user}` !== `${args.followingId}`);
                user.save();
                return user;
            }
            else {
                return user;
            }
        }),
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
//# sourceMappingURL=resolvers.js.map