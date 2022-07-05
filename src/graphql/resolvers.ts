import { generateToken } from "../helper/generateToken";
import { getUserId } from "../helper/getUserId";
import Comment from "../models/comment";
import User from "../models/user";

export const resolvers = {
  Query: {
    getUser: async (_,args) => {
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
    getFavoriteMovies : async (parent, args, context) => {
      try {
        const userId = getUserId(context.req);
      if (!userId) throw new Error("Please Login!");
      const user = await User.findById(userId);
      return user.favoriteMovies
      } catch (error) {
        throw new Error(error.message);

      }
    },
    getSavedMovies : async (parent, args, context) => {
      try {
        const userId = getUserId(context.req);
      if (!userId) throw new Error("Please Login!");
      const user = await User.findById(userId);
      return user.savedMovies
      } catch (error) {
        throw new Error(error.message);

      }
    },
    getMovieComments : async(_,args) => {
      const comments = await Comment.find({
        movie : args.movie
      }).populate("user")
      console.log(comments)
      return comments
    }
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
      console.log(args)
      user.email = args.email || user.email;
      user.name = args.name || user.name;
      if(args.oldPassword && args.password ){
        const checkPassword =await user.correctPassword(
        args.oldPassword,
        user.password
      );

      if (!checkPassword)
        throw new Error("Email or Password Are Incorrect"); 
        
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
      args: {movieName: string;movieID: string ;movieImage : string},
      context
    ) => {
      const userId = getUserId(context.req);
      if (!userId) throw new Error("Please Login!");
      const user = await User.findById(userId);
      
      if(user.favoriteMovies.filter((movie) => movie.movieID == args.movieID).length)
        throw new Error("Movie already exists");
      user.favoriteMovies = [
        ...user.favoriteMovies,
        { movieID: args.movieID, movieName: args.movieName , movieImage : args.movieImage },
      ];
      await user.save();
      return user;
    },
    addSavedMovie: async (
      _,
      args: {movieName: string;movieID: string ;movieImage : string},
      context
    ) => {
      const userId = getUserId(context.req);
      if (!userId) throw new Error("Please Login!");
      const user = await User.findById(userId);
      
      if(user.savedMovies.filter((movie) => movie.movieID == args.movieID).length)
        throw new Error("Movie already exists");
      user.savedMovies = [
        ...user.savedMovies,
        { movieID: args.movieID, movieName: args.movieName , movieImage : args.movieImage },
      ];
      await user.save();
      return user;
    },
    removeMovie: async (_, args: { movieID: string }, context) => {
      const userId = getUserId(context.req);
      if (!userId) throw new Error("Please Login!");
      const user = await User.findById(userId);
      user.favoriteMovies = user.favoriteMovies.filter(
        (movie) =>  movie.movieID !== args.movieID
      );
      await user.save();
      return user;
    },
    removeSavedMovie: async (_, args: { movieID: string }, context) => {
      const userId = getUserId(context.req);
      if (!userId) throw new Error("Please Login!");
      const user = await User.findById(userId);
      user.savedMovies = user.savedMovies.filter(
        (movie) =>  movie.movieID !== args.movieID
      );
      await user.save();
      return user;
    },
    addComment : async (_,args,context) => {
      const userId = getUserId(context.req);
      if (!userId) throw new Error("Please Login!");
      const user = await User.findById(userId);
      const comment = await Comment.create({
        user : userId,
        movie : args.movie,
        content : args.content
      })
      const commentDoc = await comment.populate("user")
      return commentDoc
    },
    
  },
};
