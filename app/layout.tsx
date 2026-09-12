import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import NavLinks from "@/components/NavLinks";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Sacrament Meeting Planner",
    template: "%s | Sacrament Meeting Planner",
  },
  description:
    "Plan, manage, review, and print sacrament meeting programs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen bg-slate-50 text-slate-900`}
      >
        <div className="flex min-h-screen flex-col">
          <Header />
          <NavLinks />

          <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
            {children}
          </main>

          <Footer />
        </div>
      </body>
    </html>
  );
}