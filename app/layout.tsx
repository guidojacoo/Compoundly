import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Compoundly — Simulador de Interés Compuesto",
  description: "Simulá el poder del interés compuesto. S&P 500, Bitcoin, y más.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
