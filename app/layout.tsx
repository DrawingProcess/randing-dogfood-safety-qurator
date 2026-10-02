import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const sans = Noto_Sans_KR({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const title = "믿고멍냥 | 반려동물 먹거리 큐레이션 마켓";
const description = "성분부터 제조 정보까지 살펴보고 선별한 강아지·고양이 사료와 간식을 만나보세요.";

export const metadata: Metadata = {
  title: {
    default: title,
    template: "%s | 믿고멍냥",
  },
  description,
  openGraph: {
    title,
    description,
    locale: "ko_KR",
    type: "website",
    siteName: "믿고멍냥",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${sans.variable} h-full`}>
      <body className={`${sans.className} flex min-h-full flex-col antialiased`}>
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
