"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const commentsSchema = new mongoose_1.default.Schema({
    post: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        ref: "Post",
    },
    likes: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: "User",
        },
    ],
    user: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        ref: "User",
    },
    content: {
        type: String,
        required: true,
    },
    createdAt: { type: Date, required: true, default: Date.now },
}, {
    toJSON: {
        virtuals: true,
    },
    toObject: { virtuals: true },
});
const PostComment = mongoose_1.default.model("PostComment", commentsSchema);
exports.default = PostComment;
//# sourceMappingURL=postComment.js.map