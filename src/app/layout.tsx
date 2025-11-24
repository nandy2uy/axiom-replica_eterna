// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import StoreProvider from "./StoreProvider"; // Make sure you created this file in the previous step!
import "./globals.css";

export const metadata: Metadata = {
  title: "Axiom Replica",
  description: "High performance token discovery",
};

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${mono.variable} font-sans bg-gray-950 text-white antialiased`}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}

