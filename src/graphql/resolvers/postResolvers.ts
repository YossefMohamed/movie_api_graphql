/* eslint-disable */

import { generateToken } from "../../helper/generateToken";
import { getUserId } from "../../helper/getUserId";
import Comment from "../../models/comment";
import Post from "../../models/post";
import PostComment from "../../models/postComment";
import User from "../../models/user";

export const postResolvers = {
  Query: {
    getAllPosts: async (_, args, context) => {
      let posts;
      const argSort = args.sort?.toLowerCase();
      const sort = `${
        argSort === "newest"
          ? "-createdAt"
          : argSort === "oldest"
          ? "createdAt"
          : argSort === "top"
          ? "-likes"
          : "createdAt"
      }`;
      if (args.tag.toLowerCase() === "all") {
        if (args.following) {
          const userId = getUserId(context.req);
          if (!userId) throw new Error("Please Login!");
          const user = await User.findById(userId);
          posts = await Post.find({
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
        } else {
          posts = await Post.find()
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
      } else {
        if (args.following) {
          const userId = getUserId(context.req);
          if (!userId) throw new Error("Please Login!");
          const user = await User.findById(userId);
          posts = await Post.find({
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
        } else {
          posts = await Post.find({
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
    },
  },
  Mutation: {
    addPost: async (_, args, context) => {
      const userId = getUserId(context.req);
      if (!userId) throw new Error("Please Login!");
      const user = await User.findById(userId);
      const post = await Post.create({
        user: userId,
        content: args.content,
        tag: args.tag,
      });
      const postDoc = await post.populate("user");
      return postDoc;
    },
    likePost: async (_, args, context) => {
      const userId = getUserId(context.req);
      if (!userId) throw new Error("Please Login!");
      const post = await Post.findById(args.postId)
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
      await post.save();
      return post;
    },
    unLikePost: async (_, args, context) => {
      const userId = getUserId(context.req);
      if (!userId) throw new Error("Please Login!");
      const post = await Post.findById(args.postId)
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
      await post.save();
      return post;
    },
    addCommentToPost: async (_, args, context) => {
      const userId = getUserId(context.req);
      if (!userId) throw new Error("Please Login!");
      const comment = await PostComment.create({
        user: userId,
        post: args.postId,
        content: args.content,
      });

      const post = await Post.findById(args.postId).populate("user");

      const postDoc = await post.populate({
        path: "comments",
        populate: {
          path: "user",
          model: "User",
        },
      });
      return postDoc;
    },
    likeComment: async (_, args, context) => {
      const userId = getUserId(context.req);
      if (!userId) throw new Error("Please Login!");
      const comment = await PostComment.findById(args.commentId).populate(
        "user"
      );
      if (comment.likes.map((id) => `${id}` === `${userId}`).length) {
        return comment;
      }
      comment.likes.push(userId);
      await comment.save();
      return comment;
    },
    unLikeComment: async (_, args, context) => {
      const userId = getUserId(context.req);
      if (!userId) throw new Error("Please Login!");
      const comment = await PostComment.findById(args.commentId).populate(
        "user"
      );
      if (!comment.likes.map((id) => `${id}` === `${userId}`).length) {
        return comment;
      }
      comment.likes = comment.likes.filter((id) => `${id}` !== `${userId}`);
      await comment.save();
      return comment;
    },
  },
};
