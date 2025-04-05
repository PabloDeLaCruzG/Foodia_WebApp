import { AuthRequest } from "../interfaces/AuthRequest";
import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export default function authenticateUser(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  console.log("Cookies in request:", req.cookies);
  const token = req.cookies.token;
  console.log("Token: ", token);
  if (!token) {
    console.log("No token found!");
    res.status(401).json({ message: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    console.log("Decoded token:", decoded);
    req.user = { _id: decoded.id };

    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    res.status(401).json({ message: "Invalid token" });
    return;
  }
}
