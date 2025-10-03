import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/layout/BottomNav";
import { UserProvider } from "@/context/UserContext";
import SessionProvider from "@/components/SessionProvider";

const NunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bira'eem",
  description: "Gamified learning for Nigerian students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` ${NunitoSans.variable} antialiased`}>
        <SessionProvider>
          <UserProvider>{children}</UserProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
