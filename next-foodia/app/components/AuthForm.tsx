"use client";

import { useState } from "react";
import { authApi } from "../lib/data";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";

export default function AuthForm() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [step, setStep] = useState<"initial" | "password">("initial");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const checkEmail = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const res = await authApi.checkEmailExists(email);
      if (res.exists) {
        setMode("login");
      } else {
        setMode("register");
      }
      setStep("password");
    } catch (error) {
      // Si la petición falla por "email no encontrado" (por ejemplo, 404),
      // asumimos que se trata de un registro.
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setMode("register");
        setStep("password");
      } else {
        console.error("Error verificando el email:", error);
        setErrorMsg("Error verificando el email.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (mode === "login") {
        await authApi.loginUser({ email, password });
      } else {
        await authApi.registerUser({ email, password });
      }
      router.push("/home");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMsg =
          (error.response?.data as { message?: string })?.message ||
          "Error en la autenticación.";
        setErrorMsg(errorMsg);
      } else if (error instanceof Error) {
        setErrorMsg(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {mode === "login" ? "Iniciar Sesión" : "Bienvenido a Foodia"}
      </h2>

      {mode === "register" && (
        <p className="text-sm text-gray-600 text-center mb-4">
          Crea tu cuenta para comenzar a disfrutar de infinitas recetas.
        </p>
      )}

      <button className="w-full flex items-center justify-center gap-2 border py-2 px-4 rounded text-gray-700 hover:bg-gray-100 transition">
        <FcGoogle size={20} />{" "}
        {mode === "login" ? "Usar Google" : "Registrarse con Google"}
      </button>

      <div className="flex text-center items-center my-4 w-full">
        <hr className="w-full border-gray-300" />
        <span className="px-2 text-gray-500">OR</span>
        <hr className="w-full border-gray-300" />
      </div>

      <form onSubmit={handleSubmit} className="w-full">
        <label htmlFor="email" className="block text-gray-600 text-sm mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border text-gray-900 rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
          required
          disabled={step === "password"}
        />
        {errorMsg && <p className="text-sm text-red-500 mt-1">{errorMsg}</p>}

        {step === "initial" && (
          <button
            type="button"
            onClick={checkEmail}
            className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition mt-4"
          >
            Next
          </button>
        )}

        {step === "password" && (
          <>
            <div className="relative w-full mt-3">
              <label
                htmlFor="password"
                className="block text-gray-600 text-sm mb-1"
              >
                Password
              </label>
              {mode === "login" && (
                <a
                  href="#"
                  className="absolute right-0 top-0 text-sm text-blue-500 hover:underline"
                >
                  Forgot password?
                </a>
              )}
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border text-gray-900 rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 transition mb-3"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition mt-4"
              disabled={loading}
            >
              {loading
                ? "Cargando..."
                : mode === "login"
                ? "Iniciar Sesión"
                : "Registrarse"}
            </button>
          </>
        )}
      </form>

      <button
        onClick={() => {
          setMode("login");
          setStep("initial");
          setErrorMsg(null);
          setEmail("");
          setPassword("");
        }}
        className="text-sm text-gray-500 mt-4 hover:underline"
      >
        {mode === "register" ? "¿Ya tienes cuenta? Inicia sesión" : ""}
      </button>
    </div>
  );
}
