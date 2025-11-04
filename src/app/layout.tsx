import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppHeader } from '@/components/layout/app-header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Sazón Fácil',
  description: 'Tu compañero para una cocina fácil y deliciosa.',
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
      </head>
      <body className="font-body antialiased">
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
