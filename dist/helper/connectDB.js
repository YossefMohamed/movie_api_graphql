"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = () => {
  mongoose_1.default
    .connect(process.env.DB_URI)
    .then(() => {
      console.log("DB Connnnnected");
    })
    .catch((e) => {
      console.log(e.message);
    });
};
exports.connectDB = connectDB;
//# sourceMappingURL=connectDB.js.map
