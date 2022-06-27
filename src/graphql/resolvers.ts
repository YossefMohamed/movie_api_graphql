import { generateToken } from "../helper/generateToken";
import { getUserId } from "../helper/getUserId";
import User from "../models/user";

export const resolvers = {
  Query: {
    getUsers: async () => {
      const users = await User.find();
      return users;
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
      console.log(userId);
      if (!userId) throw new Error("Please Login!");
      const user = await User.findById(userId);
      if (!user) throw new Error("User not found");

      user.email = args.email || user.email;
      user.name = args.name || user.name;
      args.password ? (user.password = args.password) : "";
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
  },
};
