import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  favoriteMovies: { movieID: string; movieName: string ; movieImage: string }[];
  savedMovies: { movieID: string; movieName: string ; movieImage: string }[];
  verified: boolean;
  code?: string;
  createdAt: Date | number;
  image?: string;
  updatedAt: Date | number;
  correctPassword(cadPassword: string, userPassword: string): Promise<boolean>;
}
const usersSchema = new mongoose.Schema<IUser>(
  {
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
        validator: (el) => validator.isEmail(el),
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
        movieImage : {
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
        movieImage : {
          type: String,
        },
      },
    ],
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
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: { virtuals: true },
  }
);
usersSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

usersSchema.methods.correctPassword = async function (
  cadPassword,
  userPassword
) {
  return await bcrypt.compare(cadPassword, userPassword);
};

usersSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 8);
  next();
});
// usersSchema.pre(/^find/, function (next) {
//   // this points to the current query
//   this.populate({
//     path: "posts",
//   });
//   next();
// });

const User = mongoose.model("User", usersSchema);

export default User;
