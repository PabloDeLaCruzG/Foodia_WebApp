import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User";

dotenv.config();

const JWT_SECRET: string = process.env.JWT_SECRET || "secret";
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || "1d";

class AuthController {
  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        res.status(401).json({ message: "No se encontró el usuario" });
        return;
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        res.status(401).json({ message: "Contraseña incorrecta" });
        return;
      }

      const token = jwt.sign({ id: user._id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
      } as jwt.SignOptions);
      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ message: "Error al iniciar sesión" });
    }
  };

  static register = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        res.status(409).json({ message: "El usuario ya existe" });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });

      await newUser.save();

      res.status(201).json({ message: "Usuario creado con éxito" });
    } catch (error) {
      res.status(500).json({ message: "Error al crear el usuario" });
    }
  };
}

export default AuthController;
