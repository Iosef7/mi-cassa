import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Mi Cassa - CRM Inmobiliario",
  description: "Sistema integral de gestión inmobiliaria",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col m-0 p-0 overflow-hidden">
        <div className="flex h-screen w-full bg-background text-foreground">
          <Sidebar />
          <div className="flex-1 flex flex-col h-screen overflow-hidden">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
