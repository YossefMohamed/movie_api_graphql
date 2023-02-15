"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const postSchema = new mongoose_1.default.Schema({
    content: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        ref: "User",
    },
    tag: [
        {
            type: String,
        },
    ],
    likes: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: "User",
        },
    ],
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now },
}, {
    toJSON: {
        virtuals: true,
    },
    toObject: { virtuals: true },
});
postSchema.virtual("comments", {
    ref: "PostComment",
    foreignField: "post",
    localField: "_id",
});
const Post = mongoose_1.default.model("Post", postSchema);
exports.default = Post;
//# sourceMappingURL=post.js.map