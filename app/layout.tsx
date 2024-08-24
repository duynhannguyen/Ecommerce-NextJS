import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/navigation/nav";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "sonner";
import appLogo from "@/public/app-logo.svg";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shop&Go",
  description: "24/7 store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  userProfile: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="px-6 md:px-12 max-w-8xl mx-auto ">
            <Nav />
            <Toaster richColors />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
