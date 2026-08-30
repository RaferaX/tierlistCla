import type { Metadata } from "next";
import { Chakra_Petch, Inter } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import Header from "@/components/Header";

const chakra = Chakra_Petch({
  variable: "--font-chakra",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mercenários — Tier List",
  description: "Ranking de batalha do clã Mercenários (Minecraft Pixelmon)",
};

export default async function RootLayout({
  children,
}: LayoutProps<"/">) {
  const session = await auth();

  return (
    <html
      lang="pt-BR"
      className={`${chakra.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Header user={session?.user ?? null} />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
