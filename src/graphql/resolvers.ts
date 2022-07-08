/* eslint-disable */

import { generateToken } from "../helper/generateToken";
import { getUserId } from "../helper/getUserId";
import Comment from "../models/comment";
import Post from "../models/post";
import PostComment from "../models/postComment";
import User from "../models/user";

export const resolvers = {
  Query: {
    getUser: async (_, args) => {
      const user = await User.findById(args.id);
      return user;
    },
    login: async (parant, args) => {
      try {
        const { email, password } = args;
        const user = await User.findOne({
          email,
        }).select("+password +favoriteMovies");
        if (!user) throw new Error("Email or Password Are Incorrect");
        const checkPassword = await user.correctPassword(
          password,
          user.password
        );
        if (!checkPassword || !user)
          throw new Error("Email or Password Are Incorrect");
        const token = generateToken(user.id);
        return { user, token };
      } catch (e) {
        throw new Error(e.message);
      }
    },
    getFavoriteMovies: async (parent, args, context) => {
      try {
        const userId = getUserId(context.req);
        if (!userId) throw new Error("Please Login!");
        const user = await User.findById(userId);
        return user.favoriteMovies;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    getSavedMovies: async (parent, args, context) => {
      try {
        const userId = getUserId(context.req);
        if (!userId) throw new Error("Please Login!");
        const user = await User.findById(userId);
        return user.savedMovies;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    getMovieComments: async (_, args) => {
      const comments = await Comment.find({
        movie: args.movie,
      }).populate("user");
      console.log(comments);
      return comments;
    },
    getAllPosts: async () => {
      const posts = await Post.find()
        .populate("user")
        .populate("comments")
        .populate({
          path: "comments",
          populate: {
            path: "user",
            model: "User",
          },
        });
      return posts;
    },
  },
  Mutation: {
    register: async (
      _,
      args: {
        name: string;
        email: string;
        password: string;
        confirmPassword: string;
      }
    ) => {
      const user = new User(args);
      const token = generateToken(user.id);
      await user.save();
      return { token, user };
    },
    updateUser: async (parent, args, context) => {
      const userId = getUserId(context.req);
      if (!userId) throw new Error("Please Login!");
      const user = await User.findById(userId);
      if (!user) throw new Error("User not found");
      console.log(args);
      user.email = args.email || user.email;
      user.name = args.name || user.name;
      if (args.oldPassword && args.password) {
        const checkPassword = await user.correctPassword(
          args.oldPassword,
          user.password
        );

        if (!checkPassword) throw new Error("Email or Password Are Incorrect");

        user.password = args.password;
      }
      await user.save();
      return {
        user,
        token: context.req.headers.authorization.split(" ")[1],
      };
    },
    deleteUser: async (parent, args, context) => {
      const userId = getUserId(context.req);
      if (!userId) throw new Error("Please Login!");
      const user = await User.findById(userId);
      if (!user) throw new Error("User not found");
      const deletedUser = await User.findByIdAndDelete(userId);
      return deletedUser;
    },
    addMovie: async (
      _,
      args: { movieName: string; movieID: string; movieImage: string },
      context
    ) => {
      const userId = getUserId(context.req);
      if (!userId) throw new Error("Please Login!");
      const user = await User.findById(userId);

      if (
        user.favoriteMovies.filter((movie) => movie.movieID == args.movieID)
          .length
      )
        throw new Error("Movie already exists");
      user.favoriteMovies = [
        ...user.favoriteMovies,
        {
          movieID: args.movieID,
          movieName: args.movieName,
          movieImage: args.movieImage,
        },
      ];
      await user.save();
      return user;
    },
    addSavedMovie: async (
      _,
      args: { movieName: string; movieID: string; movieImage: string },
      context
    ) => {
      const userId = getUserId(context.req);
      if (!userId) throw new Error("Please Login!");
      const user = await User.findById(userId);

      if (
        user.savedMovies.filter((movie) => movie.movieID == args.movieID).length
      )
        throw new Error("Movie already exists");
      user.savedMovies = [
        ...user.savedMovies,
        {
          movieID: args.movieID,
          movieName: args.movieName,
          movieImage: args.movieImage,
        },
      ];
      await user.save();
      return user;
    },
    removeMovie: async (_, args: { movieID: string }, context) => {
      const userId = getUserId(context.req);
      if (!userId) throw new Error("Please Login!");
      const user = await User.findById(userId);
      user.favoriteMovies = user.favoriteMovies.filter(
        (movie) => movie.movieID !== args.movieID
      );
      await user.save();
      return user;
    },
    removeSavedMovie: async (_, args: { movieID: string }, context) => {
      const userId = getUserId(context.req);
      if (!userId) throw new Error("Please Login!");
      const user = await User.findById(userId);
      user.savedMovies = user.savedMovies.filter(
        (movie) => movie.movieID !== args.movieID
      );
      await user.save();
      return user;
    },
    addComment: async (_, args, context) => {
      const userId = getUserId(context.req);
      if (!userId) throw new Error("Please Login!");
      const user = await User.findById(userId);
      const comment = await Comment.create({
        user: userId,
        movie: args.movie,
        content: args.content,
      });
      const commentDoc = await comment.populate("user");
      return commentDoc;
    },
    followUser: async (_, args, context) => {
      const userId = getUserId(context.req);
      if (!userId) throw new Error("Please Login!");
      const user = await User.findById(userId);
      if (
        user.following.map((id) => `${id}` === `${args.followingId}`).length
      ) {
        return user;
      } else {
        user.following.push(args.followingId);
        user.save();
        return user;
      }
    },
    unFollowUser: async (_, args, context) => {
      const userId = getUserId(context.req);
      if (!userId) throw new Error("Please Login!");
      const user = await User.findById(userId);
      if (
        user.following.map((id) => `${id}` === `${args.followingId}`).length
      ) {
        user.following = user.following.filter(
          (user) => `${user}` !== `${args.followingId}`
        );
        user.save();
        console.log(user);
        return user;
      } else {
        return user;
      }
    },
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
      const post = await (
        await Post.findById(args.postId).populate("user")
      ).populated("comments");
      console.log(post);
      const postDoc = await post.populate("comments").populate({
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
