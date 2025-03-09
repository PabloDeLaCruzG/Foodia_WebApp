"use client";

import { useState } from "react";
import { authApi } from "../../lib/data";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FcGoogle } from "react-icons/fc"; // Icono de Google
import { AiOutlineMail, AiOutlineLock } from "react-icons/ai"; // Iconos de inputs

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      const data = await authApi.loginUser({ email, password });
      console.log("Login exitoso:", data);
      router.push("/home");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMsg =
          (error.response?.data as { message?: string })?.message ||
          "Error al iniciar sesión, intente de nuevo.";
        setErrorMsg(errorMsg);
      } else if (error instanceof Error) {
        setErrorMsg(error.message);
      }
    }
  };

  return (
    <div className="text-gray-900 flex flex-col items-center justify-center min-h-screen">
      <div className="p-8 w-full max-w-sm">
        <h1 className="text-3xl font-bold text-gray-950 text-center mb-6">
          Bienvenido a <span className="text-orange-500">Foodia</span>
        </h1>
        <button className="w-full flex items-center justify-center gap-2 border py-2 px-4 rounded text-gray-700 hover:bg-gray-200 transition">
          <FcGoogle size={20} />
          Iniciar sesión con Google
        </button>
        <div className="relative text-center my-4">
          <span className="px-2 text-gray-500">or</span>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <AiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded w-full py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              required
            />
          </div>
          <div className="relative">
            <AiOutlineLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border rounded w-full py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              required
            />
          </div>
          {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition"
          >
            Iniciar Sesión
          </button>
        </form>
        <div className="text-sm text-gray-600 text-center mt-4">
          <a href="#" className="text-orange-500 hover:underline">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </div>
    </div>
  );
}
