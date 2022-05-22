import { generateToken } from "../helper/generateToken";
import { getUserId } from "../helper/getUserId";
import User from "../models/user";

export const resolvers: any = {
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
        console.log(user)
        return { user, token };
      } catch (e) {
        throw new Error(e.message);
      }
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
    addMovie : async(_ , args : {movieName : String;movieID : String} , context) => {
      const userId = getUserId(context.req);
      if (!userId) throw new Error("Please Login!");
      const user = await User.findById(userId);
      
      user.favoriteMovies = [
        ...user.favoriteMovies , {movieID : args.movieID , movieName  : args.movieName}
      ]
      await user.save()
      console.log(user)
      return user
    }
  },
};
