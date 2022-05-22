import mongoose from "mongoose";

export const connectDB = () => {
  mongoose
    .connect(process.env.DB_URI)
    .then(() => {
      console.log("DB Connnnnected");
    })
    .catch((e) => {
      console.log(e.message);
    });
};
