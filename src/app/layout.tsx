import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Sazón Fácil",
  description: "Tu compañero para una cocina fácil y deliciosa.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Sazón Fácil",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#f97316",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link rel="apple-touch-icon" href="/icon-192.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <Providers>
          <SidebarProvider>
            <AppSidebar />
            <div className="flex min-h-svh flex-col">
              <AppHeader />
              <SidebarInset>{children}</SidebarInset>
            </div>
            <Toaster />
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  );
}
