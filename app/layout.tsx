import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import "./globals.css";

export const metadata = {
  title: "Gerar Cardápio Personalizado com IA | Weekly Menu Generator",
  description:
    "Crie cardápios semanais saudáveis adaptados às suas necessidades nutricionais com inteligência artificial. Rápido, fácil e grátis!",
  keywords: [
    "gerar cardápio",
    "cardápio semanal",
    "alimentação saudável",
    "plano alimentar",
    "nutrição",
  ],
  openGraph: {
    title: "Weekly Menu Generator - Crie seu cardápio personalizado com IA",
    description:
      "Monte cardápios semanais automáticos e inteligentes com base nas suas necessidades nutricionais.",
    url: "https://weeklymenugenerator.com.br",
    siteName: "Weekly Menu Generator",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  );
}
