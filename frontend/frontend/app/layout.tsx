import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import Providers from "./provider/Provider";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ChatBox from "./components/ChatBox";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MANVERSE | FASHION",
  description: "Premium athletic fashion for modern confidence.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <Navbar />
          {children}
          <Footer />
          <ChatBox />
        </Providers>
      </body>
    </html>
  );
}