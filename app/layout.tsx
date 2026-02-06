import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DiagnosisProvider } from "@/lib/context";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "起業診断 - あなたに最適な起業プランを無料診断",
  description: "初期費用、目標月収、必要な時間から、最も稼ぎやすいビジネスを診断します",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen flex flex-col`}
      >
        <DiagnosisProvider>
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
        </DiagnosisProvider>
      </body>
    </html>
  );
}
