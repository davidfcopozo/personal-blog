import type { Metadata } from "next";
import { Roboto as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import "@/styles/globals.css";
import { Header } from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans", style: "normal", weight: "400", display: "swap"
})

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
    <html lang="en">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
