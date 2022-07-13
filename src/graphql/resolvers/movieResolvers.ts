import User from "../../models/user";
import { getUserId } from "../../helper/getUserId";
import Comment from "../../models/comment";

export const movieResolvers = {
  Query: {
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
      return comments;
    },
  },
  Mutation: {
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
      const comment = await Comment.create({
        user: userId,
        movie: args.movie,
        content: args.content,
      });

      const commentDoc = await comment.populate("user");
      return commentDoc;
    },
  },
};
