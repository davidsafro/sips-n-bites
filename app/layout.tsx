import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from "@/context/cart-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sips & Bites | Premium Ghanaian Delicacies",
  description:
    "Pure satisfaction for your cravings. Premium BanBite, ChocoBite, and Creamy Ken crafted with love in Cape Coast, Ghana.",
  keywords: ["Ghanaian food", "BanBite", "ChocoBite", "Creamy Ken", "Cape Coast", "Sips and Bites"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
