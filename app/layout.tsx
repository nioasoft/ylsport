import type { Metadata } from "next";
import { Assistant } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { Toaster } from "@/components/ui/toaster";

const assistant = Assistant({
  subsets: ["latin", "hebrew"],
  variable: "--font-assistant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "YL Sport Tights - טייץ ספורט מנאופרן",
  description: "טייץ ספורט מנאופרן לשריפת קלוריות מוגברת ועיצוב הגוף. מתאים לאימונים, יוגה ופילאטיס.",
  keywords: ["טייץ ספורט", "נאופרן", "שריפת קלוריות", "עיצוב גוף", "בגדי ספורט לנשים"],
  authors: [{ name: "YL Sport - Yifat Levi" }],
  openGraph: {
    title: "YL Sport Tights - טייץ ספורט מנאופרן",
    description: "טייץ ספורט מנאופרן לשריפת קלוריות מוגברת ועיצוב הגוף",
    type: "website",
    locale: "he_IL",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${assistant.variable} font-sans antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
