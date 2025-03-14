import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User, { IUser } from "../models/User";

dotenv.config();

const JWT_SECRET: string = process.env.JWT_SECRET || "secret";
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || "1d";

class AuthController {
  // --------------------------------------------------------------------------------------
  // REGISTRO
  // --------------------------------------------------------------------------------------
  static register = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body as IUser;

      // Verificar si ya existe un usuario con ese email
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(409).json({ message: "El usuario ya existe" });
        return;
      }

      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear y guardar el usuario
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });
      await newUser.save();

      // Generar token JWT
      const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
      } as jwt.SignOptions);

      // Guardar el token en una cookie httpOnly
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // en producción true
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 día en ms
      });

      // Enviamos 201 + un mensaje de éxito
      // (no devolvemos el token en el body, ya está en la cookie)
      res.status(201).json({ message: "Usuario creado con éxito" });
      return;
    } catch (error) {
      console.error("Error en register:", error);
      res.status(500).json({ message: "Error al crear el usuario" });
      return;
    }
  };

  // --------------------------------------------------------------------------------------
  // LOGIN
  // --------------------------------------------------------------------------------------
  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // Buscar usuario
      const user = await User.findOne({ email });
      if (!user) {
        res.status(401).json({ message: "No se encontró el usuario" });
        return;
      }

      // Comparar contraseñas
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        res.status(401).json({ message: "Contraseña incorrecta" });
        return;
      }

      // Generar token JWT
      const token = jwt.sign({ id: user._id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
      } as jwt.SignOptions);

      // Setear cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res
        .status(200)
        .json({ message: "Inicio de sesión exitoso", token: token });
      return;
    } catch (error) {
      console.error("Error en login:", error);
      res.status(500).json({ message: "Error al iniciar sesión" });
      return;
    }
  };

  static getCurrentUser = async (req: Request, res: Response) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        res.status(401).json({ message: "No se encontró el token" });
        return;
      }

      // Verificar si el token es válido
      const { id } = jwt.verify(token, JWT_SECRET) as { id: string };

      // Buscar el usuario
      const user = await User.findById(id);
      if (!user) {
        res.status(401).json({ message: "No se encontró el usuario" });
        return;
      }

      res.status(200).json(user);
      return;
    } catch (error) {
      console.error("Error en getCurrentUser:", error);
      res.status(500).json({ message: "Error al obtener el usuario" });
      return;
    }
  };

  static checkEmailExists = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        res.status(200).json({ exists: false });
        return;
      }

      res.status(200).json({ exists: true });
      return;
    } catch (error) {
      console.error("Error en checkEmailExists:", error);
      res.status(500).json({ message: "Error al verificar el email" });
      return;
    }
  };
}

export default AuthController;
