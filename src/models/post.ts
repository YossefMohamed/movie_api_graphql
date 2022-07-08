import mongoose from "mongoose";

interface IPost extends mongoose.Document {
  content: string;
  user: mongoose.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  tag: string[];
  likes: mongoose.ObjectId[];
}

const postSchema = new mongoose.Schema<IPost>(
  {
    content: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
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
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: { virtuals: true },
  }
);

postSchema.virtual("comments", {
  ref: "PostComment",
  foreignField: "post",
  localField: "_id",
});

const Post = mongoose.model("Post", postSchema);

export default Post;
