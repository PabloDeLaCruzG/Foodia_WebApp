"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { authApi } from "@/app/lib/data";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";

interface FormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const watchPassword = watch("password", "");

  const onSubmit = handleSubmit(async (data) => {
    const { name, email, password, confirmPassword } = data;

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    try {
      setLoading(true);

      const response = await authApi.registerUser({ name, email, password });
      console.log("Respuesta del back:", response);

      toast.success("Usuario creado con éxito");

      router.push("/home");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        // Aquí err ya se sabe que es AxiosError, y podemos acceder a sus propiedades
        const errorMsg =
          (err.response?.data as { message?: string })?.message ||
          "Error al registrar";
        toast.error(errorMsg);
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Error al registrar");
      }
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] items-center justify-center">
      <h1 className="text-3xl font-bold">Register</h1>
      <form onSubmit={onSubmit} className="w-80 mt-4">
        <label htmlFor="username" className="block mb-2 text-slate-300">
          Username
        </label>
        <input
          type="text"
          {...register("name", {
            required: { value: true, message: "Username is required" },
          })}
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
          placeholder="Your username"
        />
        {errors.name && (
          <span className="text-red-500 text-xs">{errors.name.message}</span>
        )}
        <label htmlFor="email" className="block mb-2 text-slate-300">
          Email
        </label>
        <input
          type="email"
          {...register("email", {
            required: { value: true, message: "Email is required" },
          })}
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
          placeholder="Your email@example.com"
        />
        {errors.email && (
          <span className="text-red-500 text-xs">{errors.email.message}</span>
        )}
        <label htmlFor="password" className="block mb-2 text-slate-300">
          Password
        </label>
        <input
          type="password"
          {...register("password", {
            required: { value: true, message: "Password is required" },
          })}
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
          placeholder="Your password"
        />
        {errors.password && (
          <span className="text-red-500 text-xs">
            {errors.password.message}
          </span>
        )}
        <label htmlFor="confirmPassword" className="block mb-2 text-slate-300">
          Confirm Password
        </label>
        <input
          type="password"
          {...register("confirmPassword", {
            required: { value: true, message: "Confirm password is required" },
            validate: (value) =>
              value === watchPassword || "Passwords do not match",
          })}
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
          placeholder="Confirm your password"
        />
        {errors.confirmPassword && (
          <span className="text-red-500 text-xs">
            {errors.confirmPassword.message}
          </span>
        )}

        <button
          type="submit"
          className="p-3 rounded block mb-2 bg-blue-500 text-slate-300 w-full"
          disabled={loading}
        >
          {loading ? "Loading..." : "Register"}
        </button>
      </form>
    </div>
  );
}
