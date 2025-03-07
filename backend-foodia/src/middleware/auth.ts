import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

const verifyToken: RequestHandler = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ message: "No hay token en la cabecera" });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Formato de token inválido" });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    (req as any)._id = decoded.id;

    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido o expirado" });
  }
};

export default verifyToken;
