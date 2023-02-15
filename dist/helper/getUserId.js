"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserId = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getUserId = (req) => {
    if (!req.headers.authorization)
        throw new Error("Please Login!");
    const token = req.headers.authorization.startsWith("Bearer")
        ? req.headers.authorization.split(" ")[1]
        : "";
    let id;
    if (token) {
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "YOSSEF'SSECRET", (err, decoded) => {
            if (err)
                throw new Error("Please Login!");
            id = decoded.id;
        });
    }
    return id;
};
exports.getUserId = getUserId;
//# sourceMappingURL=getUserId.js.map