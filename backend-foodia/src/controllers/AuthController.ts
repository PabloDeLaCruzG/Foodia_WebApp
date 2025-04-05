import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User, { IUser } from "../models/User";
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

dotenv.config();

const JWT_SECRET: string = process.env.JWT_SECRET || "secret";
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || "1d";

class AuthController {
  static googleAuth = async (req: Request, res: Response) => {
    try {
      const { idToken } = req.body;
      if (!idToken) {
        res.status(400).json({ error: "No se recibió el token de Google" });
        return;
      }

      // verificar si el token es válido
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const { email, name } = payload;

      let user = await User.findOne({ email });
      if (!user) {
        user = new User({
          name,
          email,
          authProvider: "google",
        });
        await user.save();
      }

      const token = jwt.sign({ id: user._id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
      } as jwt.SignOptions);

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.status(200).json({ token, user });
    } catch (error) {
      console.error("Error en googleAuth:", error);
      res.status(500).json({ message: "Error al iniciar sesión" });
      return;
    }
  };

  static register = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body as IUser;

      // Le asigna el nombre del usuario a partir del email
      const name = email.split("@")[0];

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
        authProvider: "local",
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

  static logout = async (req: Request, res: Response) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Sesión cerrada correctamente" });
    return;
  };

  static checkEmailExists = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        res.status(200).json({ exists: false });
        return;
      }

      res
        .status(200)
        .json({ exists: true, authProvider: user.authProvider || "local" });
      return;
    } catch (error) {
      console.error("Error en checkEmailExists:", error);
      res.status(500).json({ message: "Error al verificar el email" });
      return;
    }
  };
}

export default AuthController;
