import { IUser } from "../../models/User"; // O tu propia interfaz de usuario

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string; // o "id" según cómo lo manejes
        // ...cualquier otro campo que quieras inyectar
      };
    }
  }
}
