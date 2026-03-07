import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../app/store/cartStore";
import ChatBox from "./components/ChatBox";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MANVERSE | FASHION",
  description: "Premium athletic fashion for modern confidence.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CartProvider>
          <Navbar />
          {children}
          <Footer />
          <ChatBox />
        </CartProvider>
      </body>
    </html>
  );
}