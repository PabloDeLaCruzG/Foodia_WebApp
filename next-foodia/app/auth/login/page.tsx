"use client";

import { useState } from "react";
import { authApi } from "../../lib/data";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      // Llama al método loginUser de tu data.ts
      const data = await authApi.loginUser({ email, password });
      console.log("Login exitoso:", data);
      router.push("/home");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // Aquí error ya se sabe que es AxiosError, y podemos acceder a sus propiedades
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Iniciar Sesión</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1">
            Email:
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full"
            placeholder="Email"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-1">
            Contraseña:
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full"
            placeholder="Contraseña"
            required
          />
        </div>
        {errorMsg && <p className="text-red-500 text-sm mb-4">{errorMsg}</p>}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded"
        >
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
}
