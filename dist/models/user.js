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
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const usersSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Please Write Your Name"],
    },
    email: {
        type: String,
        required: [true, "Please Provide Your Email !"],
        trim: true,
        lowercase: true,
        unique: true,
        validate: {
            validator: (el) => validator_1.default.isEmail(el),
            message: "Please Provide A valide Email ",
        },
    },
    image: {
        type: String,
        default: "avatar.png",
    },
    favoriteMovies: [
        {
            movieID: {
                type: Number,
            },
            movieName: {
                type: String,
            },
            movieImage: {
                type: String,
            },
        },
    ],
    savedMovies: [
        {
            movieID: {
                type: Number,
            },
            movieName: {
                type: String,
            },
            movieImage: {
                type: String,
            },
        },
    ],
    following: [{
            type: mongoose_1.default.Types.ObjectId,
            required: true,
            ref: "User"
        }],
    deleted: {
        type: Boolean,
        default: false
    },
    verified: {
        type: Boolean,
        default: false,
    },
    code: {
        type: String,
    },
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now },
    password: {
        type: String,
        minlength: [8, "Password Must Be More Than 8 Chars !"],
        maxlength: 25,
        required: [true, "Please Enter Your Password !"],
        select: false,
    },
}, {
    toJSON: {
        virtuals: true,
    },
    toObject: { virtuals: true },
});
usersSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});
usersSchema.methods.correctPassword = function (cadPassword, userPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(cadPassword, userPassword);
    });
};
usersSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password"))
            return next();
        this.password = yield bcryptjs_1.default.hash(this.password, 8);
        next();
    });
});
// usersSchema.pre(/^find/, function (next) {
//   // this points to the current query
//   this.populate({
//     path: "posts",
//   });
//   next();
// });
const User = mongoose_1.default.model("User", usersSchema);
exports.default = User;
//# sourceMappingURL=user.js.map