import User from "../../models/user";
import { generateToken } from "../../helper/generateToken";
import { getUserId } from "../../helper/getUserId";

export const userResolvers = {
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

    getFollowing: async (_, args, context) => {
      try {
        const userId = getUserId(context.req);
        if (!userId) throw new Error("Please Login!");
        const type = args.type;

        if (type === "following") {
          const user = await User.findById(userId).populate("following");
          return user.following;
        }
        if (type === "followers") {
          const users = await User.find({ following: { $in: [userId] } });
          return users;
        }
        return [];
      } catch (error) {
        throw new Error(error.message);
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
      if (!userId) throw new Error("Please Login!");
      const user = await User.findById(userId);
      if (!user) throw new Error("User not found");
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
      user.deleted = true;
      await user.save();
      return user;
    },
    followUser: async (_, args, context) => {
      const userId = getUserId(context.req);
      if (!userId) throw new Error("Please Login!");
      const user = await User.findById(userId);
      if (user.following.find((id) => `${id}` === `${args.followingId}`)) {
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
        return user;
      } else {
        return user;
      }
    },
  },
};
