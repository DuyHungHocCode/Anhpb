import type { Metadata } from "next";
import { Courier_Prime } from "next/font/google";
import "./globals.css";

/**
 * Courier Prime — font chữ in máy đánh chữ thời xưa.
 *
 * Lưu ý quan trọng: Courier Prime (kể cả bản gốc) không chứa glyph
 * tiếng Việt tổ hợp sẵn (ế, ộ, ơ, ư, ẫ…). Vì vậy ta khai báo chuỗi
 * fallback metric-tương-thích: 'Courier New' (Windows/macOS) và
 * 'Liberation Mono' (Linux) — cả hai cùng kiểu chữ máy, cùng độ rộng
 * ký tự (0.6em) và đều hỗ trợ đầy đủ tiếng Việt, nên chữ hiển thị
 * đồng bộ như một font duy nhất.
 */
const courierPrime = Courier_Prime({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-courier-prime",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["Courier New", "Liberation Mono", "Noto Sans Mono", "monospace"],
});

export const metadata: Metadata = {
  title: "Tiếng Máy Chữ — Tuần báo hoài cổ",
  description:
    "Trang báo phong cách retro vintage: nền giấy trắng ngà có vân nhám sần, chữ mực đen, bố cục editorial tối giản, font máy đánh chữ Courier Prime.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Biến font gắn trên <html> để :root trong vintage.css nhìn thấy
    <html lang="vi" suppressHydrationWarning className={courierPrime.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
