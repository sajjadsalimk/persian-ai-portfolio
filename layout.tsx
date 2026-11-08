import type { Metadata } from "next";
import CursorTrail from "./components/cursor-trail";
import "./globals.css";

export const metadata: Metadata = {
  title: "سجاد | برنامه‌نویس و علاقه‌مند به هوش مصنوعی",
  description: "فضای شخصی سجاد؛ برنامه‌نویس و سازندهٔ تجربه‌های هوشمند با هوش مصنوعی.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}<CursorTrail /></body>
    </html>
  );
}
