import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Foodia Generator",
  description: "Generador de recetas de comida",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
