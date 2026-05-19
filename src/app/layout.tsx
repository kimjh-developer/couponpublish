import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "수거히어로 쿠폰 어드민",
  description: "SUGO HERO 오픈 이벤트 쿠폰 발급/인쇄 시스템",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[var(--toss-gray-50)] text-[var(--toss-gray-900)]">
        {children}
      </body>
    </html>
  );
}
