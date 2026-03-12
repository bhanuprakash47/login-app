import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../config/env.js";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
    if (err) {
      console.error("Token verification failed:", err);
      return res.status(401).json({ message: "Token is not valid!" });
    }

    req.user = user;
    next();
  });
}

export default verifyToken
