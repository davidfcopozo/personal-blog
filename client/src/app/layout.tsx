import type { Metadata } from "next";
import { Roboto as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { Header } from "@/components/header";
import { ThemeProvider } from "@/context/theme-provider";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import QueryProvider from "@/context/QueryProvider";
import { AuthContextProvider } from "../context/AuthContext";
import { UnverifiedEmailBanner } from "@/components/unverified-email-banner";
import { SocketProvider } from "@/context/SocketContext";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* <head>
        <script
          src="//unpkg.com/react-scan/dist/auto.global.js"
          crossOrigin="anonymous"
          async
        ></script>
      </head> */}
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased !pointer-events-auto",
          fontSans.variable
        )}
      >
        <QueryProvider>
          <AuthProvider>
            <AuthContextProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                {" "}
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
      </body>
    </html>
  );
}
