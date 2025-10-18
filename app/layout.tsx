import { RoomProvider } from "@/contexts/RoomContext";
import { UserProvider } from "@/contexts/UserContext";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "HollyPolly - Gerçek Zamanlı Kura Çekme Uygulaması",
  description: "Arkadaşlarınla gerçek zamanlı olarak kura çek!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-orange-50 min-h-screen`}
      >
        <UserProvider>
          <RoomProvider>
            {children}
          </RoomProvider>
        </UserProvider>
      </body>
    </html>
  );
}
