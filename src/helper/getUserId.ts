import jwt from "jsonwebtoken";

export const getUserId = (req) => {
  console.log(req.headers.authorization);
  if (!req.headers.authorization) throw new Error("Please Login!");

  const token = req.headers.authorization.startsWith("Bearer")
    ? req.headers.authorization.split(" ")[1]
    : "";
  console.log(token);
  let id;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET || "YOSSEF'SSECRET", (err, decoded) => {
  console.log(decoded);

      if (err) throw new Error("Please Login!");
      id = decoded.id;
    });
  }
  return id;
};
