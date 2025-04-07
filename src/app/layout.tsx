import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FloatingNav } from "@/components/FloatingNav";
import Footer from "@/components/Footer";
import ApolloClientProvider from "@/context/ApolloProvider";
import UserProvider from "@/context/UserProvider";
import { useUserStore } from "@/store/useUserStore";
import FixedHeader from "@/components/FixedHeader";
import { Toaster } from "react-hot-toast";
import ChatListenerWrapper from "@/context/ChatListenerWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ReadCycle | Buy & Sell Pre-Loved Books",
  description:
    "ReadCycle is an online platform to buy, sell, and exchange second-hand books with ease. Join the community, save money, and give books a second life.",
  icons: {
    icon: "/favicon.png", // or "/favicon.ico" if you're using that
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#fffcf5]`}
      >
        <UserProvider>
          <ApolloClientProvider>
            <ChatListenerWrapper />
            <FloatingNav
              navItems={[
                { name: "Home", link: "#" },
                { name: "Browse Books", link: "#" },
                { name: "Sell Books", link: "#" },
              ]}
              className="bg-[#5C4033] text-[#FFEDD5]" // Cocoa Brown with Soft Peach Text
            />
            <FixedHeader />

            <main className="flex-grow relative ">{children}</main>
            <Toaster />
            <Footer />
          </ApolloClientProvider>
        </UserProvider>
      </body>
    </html>
  );
}
