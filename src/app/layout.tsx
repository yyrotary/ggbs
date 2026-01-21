import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "금가보석 | 프리미엄 관리 시스템",
  description: "프리미엄 보석 관리 시스템 커스터머 스위트",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
