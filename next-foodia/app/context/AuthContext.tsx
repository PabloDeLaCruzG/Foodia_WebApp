"use client";

import axios from "axios";
import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";

// Define la interfaz para el usuario
interface IUser {
  _id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    // Puedes obtener el usuario desde localStorage, cookies o llamando a un endpoint
    axios
      .get("https://backend-foodia-production.up.railway.app/api/users/user", { withCredentials: true })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error obteniendo el usuario:", error);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
