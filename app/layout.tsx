import { RoomProvider } from "@/contexts/RoomContext";
import { UserProvider } from "@/contexts/UserContext";
import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();

  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-orange-50 min-h-screen`}
      >
        <NextIntlClientProvider messages={messages}>
          <UserProvider>
            <RoomProvider>
              {children}
            </RoomProvider>
          </UserProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
