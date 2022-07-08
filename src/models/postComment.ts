import mongoose from "mongoose";

export interface IPostComment extends mongoose.Document {
  post: mongoose.ObjectId;
  user: mongoose.ObjectId;
  content: string;
  createdAt: Date | number;
  likes: mongoose.ObjectId[];
}

const commentsSchema = new mongoose.Schema<IPostComment>(
  {
    post: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Post",
    },
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    content: {
      type: String,
      required: true,
    },
    createdAt: { type: Date, required: true, default: Date.now },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: { virtuals: true },
  }
);

const PostComment = mongoose.model("PostComment", commentsSchema);

export default PostComment;
