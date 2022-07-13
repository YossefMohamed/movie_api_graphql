import { getUserId } from "../../helper/getUserId";
import Comment from "../../models/comment";

export const commentResolvers = {
  Query: {
    getMovieComments: async (_, args) => {
      const comments = await Comment.find({
        movie: args.movie,
      }).populate("user");
      return comments;
    },
  },
  Mutation: {
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
