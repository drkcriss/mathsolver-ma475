import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import BottomNav from "@/components/bottom-nav";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MathSolver MA475",
  description:
    "Herramientas de calculo para el curso MA475 Matematica Computacional — congruencias, RSA y validacion NIF.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MathSolver MA475",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.className}>
      <body className="min-h-dvh bg-surface body-with-nav antialiased">
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
