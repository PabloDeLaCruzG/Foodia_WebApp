import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET: string = process.env.JWT_SECRET || "secret";

export function resetDailyUsage(user: IUser) {
  const today = new Date();
  // Si el user no tiene fecha, la inicializamos
  if (!user.lastGenerationDate) {
    user.lastGenerationDate = today;
    user.dailyGenerationCount = 3;
    user.rewardedGenerations = 0;
    return;
  }

  const lastGen = new Date(user.lastGenerationDate);
  const isDifferentDay =
    lastGen.getDate() !== today.getDate() ||
    lastGen.getMonth() !== today.getMonth() ||
    lastGen.getFullYear() !== today.getFullYear();

  if (isDifferentDay) {
    user.lastGenerationDate = today;
    user.dailyGenerationCount = 3; // Resetea a 3
    user.rewardedGenerations = 0; // O, si prefieres, deja la que tenía
  }
}

class UserController {
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

  static async watchAdReward(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const user = await User.findById(userId);
      if (!user) {
        res.status(401).json({ message: "Usuario no encontrado" });
        return;
      }

      // Resetear si es un nuevo día
      resetDailyUsage(user);

      // Sumar 1 recompensa
      user.rewardedGenerations = (user.rewardedGenerations || 0) + 1;
      await user.save();

      // Devolvemos info actualizada
      res.status(200).json({
        message: "Has recibido +1 generación adicional",
        dailyGenerationCount: user.dailyGenerationCount,
        rewardedGenerations: user.rewardedGenerations,
      });
      return;
    } catch (error) {
      console.error("Error en watchAdReward:", error);
      res.status(500).json({ message: "Error al procesar la recompensa" });

      return;
    }
  }

  static async getDailyStatus(req: Request, res: Response) {
    try {
      const userId = (req as any).user._id;
      const user = await User.findById(userId);
      if (!user) {
        res.status(401).json({ message: "Usuario no encontrado" });
        return;
      }

      // Resetear si es un nuevo día
      resetDailyUsage(user);
      await user.save();

      // Calculamos cuántos quedan:
      //  dailyGenerationCount + rewardedGenerations = total disponibles
      const totalDisponibles =
        (user.dailyGenerationCount || 0) + (user.rewardedGenerations || 0);

      res.status(200).json({
        dailyGenerationCount: user.dailyGenerationCount,
        rewardedGenerations: user.rewardedGenerations,
        totalDisponibles,
        lastGenerationDate: user.lastGenerationDate,
      });
    } catch (error) {
      console.error("Error en getDailyStatus:", error);
      res.status(500).json({ message: "Error al obtener estado diario" });
      return;
    }
  }
}

export default UserController;
