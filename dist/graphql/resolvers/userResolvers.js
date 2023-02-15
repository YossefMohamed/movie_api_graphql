"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userResolvers = void 0;
const user_1 = __importDefault(require("../../models/user"));
const generateToken_1 = require("../../helper/generateToken");
const getUserId_1 = require("../../helper/getUserId");
exports.userResolvers = {
    Query: {
        getUser: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield user_1.default.findById(args.id);
            return user;
        }),
        login: (parant, args) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { email, password } = args;
                const user = yield user_1.default.findOne({
                    email,
                }).select("+password +favoriteMovies");
                if (!user)
                    throw new Error("Email or Password Are Incorrect");
                const checkPassword = yield user.correctPassword(password, user.password);
                if (!checkPassword || !user)
                    throw new Error("Email or Password Are Incorrect");
                const token = (0, generateToken_1.generateToken)(user.id);
                user.deleted = false;
                return { user, token };
            }
            catch (e) {
                throw new Error(e.message);
            }
        }),
        getFollowing: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const userId = (0, getUserId_1.getUserId)(context.req);
                if (!userId)
                    throw new Error("Please Login!");
                const type = args.type;
                if (type === "following") {
                    const user = yield user_1.default.findById(userId).populate("following");
                    return user.following;
                }
                if (type === "followers") {
                    const users = yield user_1.default.find({ following: { $in: [userId] } });
                    return users;
                }
                return [];
            }
            catch (error) {
                throw new Error(error.message);
            }
        }),
    },
    Mutation: {
        register: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const user = new user_1.default(args);
            const token = (0, generateToken_1.generateToken)(user.id);
            yield user.save();
            return { token, user };
        }),
        updateUser: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            const userId = (0, getUserId_1.getUserId)(context.req);
            if (!userId)
                throw new Error("Please Login!");
            const user = yield user_1.default.findById(userId);
            if (!user)
                throw new Error("User not found");
            user.email = args.email || user.email;
            user.name = args.name || user.name;
            if (args.oldPassword && args.password) {
                const checkPassword = yield user.correctPassword(args.oldPassword, user.password);
                if (!checkPassword)
                    throw new Error("Email or Password Are Incorrect");
                user.password = args.password;
            }
            yield user.save();
            return {
                user,
                token: context.req.headers.authorization.split(" ")[1],
            };
        }),
        deleteUser: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            const userId = (0, getUserId_1.getUserId)(context.req);
            if (!userId)
                throw new Error("Please Login!");
            const user = yield user_1.default.findById(userId);
            if (!user)
                throw new Error("User not found");
            user.deleted = true;
            yield user.save();
            return user;
        }),
        followUser: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            const userId = (0, getUserId_1.getUserId)(context.req);
            if (!userId)
                throw new Error("Please Login!");
            const user = yield user_1.default.findById(userId);
            if (user.following.find((id) => `${id}` === `${args.followingId}`)) {
                return user;
            }
            else {
                user.following.push(args.followingId);
                user.save();
                return user;
            }
        }),
        unFollowUser: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            const userId = (0, getUserId_1.getUserId)(context.req);
            if (!userId)
                throw new Error("Please Login!");
            const user = yield user_1.default.findById(userId);
            if (user.following.map((id) => `${id}` === `${args.followingId}`).length) {
                user.following = user.following.filter((user) => `${user}` !== `${args.followingId}`);
                user.save();
                return user;
            }
            else {
                return user;
            }
        }),
    },
};
//# sourceMappingURL=userResolvers.js.map