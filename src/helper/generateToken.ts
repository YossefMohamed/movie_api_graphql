import jwt from "jsonwebtoken";

export const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "YOSSEF'SSECRET", {
    expiresIn: "90d",
  });
};
