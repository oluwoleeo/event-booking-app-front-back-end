import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/app/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Events Booking App",
  description: "App for creating and booking events",
};

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} >
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Events Booking App</h1>
          </header>
          <AuthProvider>
          {children}
          </AuthProvider>
        </div>
      </body>
    </html>
  )
}