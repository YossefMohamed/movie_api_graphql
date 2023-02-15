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
exports.commentResolvers = void 0;
const getUserId_1 = require("../../helper/getUserId");
const comment_1 = __importDefault(require("../../models/comment"));
exports.commentResolvers = {
    Query: {
        getMovieComments: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const comments = yield comment_1.default.find({
                movie: args.movie,
            }).populate("user");
            return comments;
        }),
    },
    Mutation: {
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
//# sourceMappingURL=commentResolvers.js.map