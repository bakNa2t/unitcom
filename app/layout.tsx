import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ConvexClientProvider } from "@/components/providers/convex-provider";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Unitcom",
  description: "Unitcom is a next-generation chat application",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: dark)",
        url: "/logo-light.svg",
        href: "/logo-light.svg",
      },
      {
        media: "(prefers-color-scheme: light)",
        url: "/logo-dark.svg",
        href: "/logo-dark.svg",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConvexClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>{children}</TooltipProvider>
            <Toaster richColors />
          </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
