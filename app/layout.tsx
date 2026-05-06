import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./lib/cart";
import { LanguageProvider } from "./lib/i18n";
import MarqueeBanner from "./components/MarqueeBanner";
import Header from "./components/Header";
import Footer from "./components/Footer";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "K-STORM | K-POP 포토카드 & 굿즈 쇼핑몰",
  description:
    "K-POP 앨범, 한정판 포토카드, 응원봉, 공식 굿즈를 만나보세요. 전 세계 팬을 위한 K-STORM 공식 스토어",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        <LanguageProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col bg-white">
              <MarqueeBanner />
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
