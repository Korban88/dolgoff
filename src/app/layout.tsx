import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "ДолгOFF — калькулятор долгов",
  description: "Рассчитайте стратегию погашения долгов и узнайте дату финансовой свободы",
  icons: {
    icon: "/favicon.ico",
  },
};

// Inline script to apply theme before first paint — prevents flash
function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `try{var t=localStorage.getItem('dolgoff-theme')||'dark';document.documentElement.setAttribute('data-theme',t);}catch(e){}`,
      }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${inter.variable} h-full`} data-theme="dark" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${inter.variable} min-h-full flex flex-col font-sans antialiased`}>{children}</body>
    </html>
  );
}
