import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import NextTopLoader from 'nextjs-toploader';
import { ThemeProvider } from "@/components/ThemeProvider";
import AuthProvider from "@/components/AuthProvider";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { defaultLocale, Locale } from "@/lib/i18n/dictionaries";
import { cookies } from "next/headers";
import { Toaster } from "sonner";
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
  title: "Mi Cassa - CRM Inmobiliario",
  description: "Sistema integral de gestión inmobiliaria",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Mi Cassa",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  themeColor: "#000000",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value as Locale | undefined;
  const initialLocale = localeCookie || defaultLocale;
  const dir = initialLocale === "he" ? "rtl" : "ltr";

  return (
    <html
      lang={initialLocale}
      dir={dir}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col m-0 p-0 bg-background text-foreground">
        <AuthProvider>
          <LanguageProvider initialLocale={initialLocale}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <NextTopLoader
                color="#3b82f6"
                initialPosition={0.08}
                crawlSpeed={200}
                height={3}
                crawl={true}
                showSpinner={false}
                easing="ease"
                speed={200}
                shadow="0 0 10px #3b82f6,0 0 5px #3b82f6"
              />
              {children}
              <Toaster position="top-center" richColors />
            </ThemeProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
