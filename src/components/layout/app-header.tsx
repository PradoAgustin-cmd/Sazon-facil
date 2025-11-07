'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { UtensilsCrossed, User } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export function AppHeader() {
  const { isMobile } = useSidebar();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUserEmail(u?.email ?? null);
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.reload();
    } catch (e) {
      console.error('Error al cerrar sesión:', e);
    }
  };

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6">
      <SidebarTrigger className="flex md:hidden" />
      {!isMobile && (
        <Link
          href="/"
          className="font-headline text-xl font-bold flex items-center gap-2"
        >
          <UtensilsCrossed className="h-5 w-5 text-primary-foreground" />
          Sazón Fácil
        </Link>
      )}

      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="overflow-hidden rounded-full"
            >
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {userEmail ? `Conectado: ${userEmail}` : 'Mi Cuenta'}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">Perfil</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">Ajustes</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {userEmail ? (
              <DropdownMenuItem onClick={handleLogout}>
                Cerrar Sesión
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem asChild>
                <Link href="/login">Iniciar Sesión</Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
