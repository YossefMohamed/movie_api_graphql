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
exports.movieResolvers = void 0;
const user_1 = __importDefault(require("../../models/user"));
const getUserId_1 = require("../../helper/getUserId");
const comment_1 = __importDefault(require("../../models/comment"));
exports.movieResolvers = {
    Query: {
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
    },
    Mutation: {
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
            const comment = yield comment_1.default.create({
                user: userId,
                movie: args.movie,
                content: args.content,
            });
            const commentDoc = yield comment.populate("user");
            return commentDoc;
        }),
    },
};
//# sourceMappingURL=movieResolvers.js.map