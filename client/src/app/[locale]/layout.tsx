import type { Metadata } from "next";
import { Roboto as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { Header } from "@/components/header";
import { ThemeProvider } from "@/context/theme-provider";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import QueryProvider from "@/context/QueryProvider";
import { AuthContextProvider } from "../../context/AuthContext";
import { UnverifiedEmailBanner } from "@/components/unverified-email-banner";
import { SocketProvider } from "@/context/SocketContext";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "@/i18n/config";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  style: "normal",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TechyComm",
  description: "One post at a time",
};

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client side is the easiest way to get started
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} suppressHydrationWarning>
      {process.env.NODE_ENV === "development" && (
        <head>
          <script
            src="//unpkg.com/react-scan/dist/auto.global.js"
            crossOrigin="anonymous"
            async
          ></script>
        </head>
      )}
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased !pointer-events-auto",
          fontSans.variable
        )}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <QueryProvider>
            <AuthProvider>
              <AuthContextProvider>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
                >
                  <SocketProvider>
                    <Header />
                    <UnverifiedEmailBanner />
                    {children}
                    <Toaster />
                  </SocketProvider>
                </ThemeProvider>
              </AuthContextProvider>
            </AuthProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
