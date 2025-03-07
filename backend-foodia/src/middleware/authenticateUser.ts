import { AuthRequest } from "../interfaces/AuthRequest";
import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export default function authenticateUser(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    console.log("Decoded token:", decoded);

    req.user = { _id: decoded.id };

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }
}
