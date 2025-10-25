'use client';
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  Heart,
  Search,
  Sparkles,
  Calendar,
  Upload,
  Archive,
  UtensilsCrossed,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AppSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="font-headline text-xl font-bold flex items-center gap-2">
          <UtensilsCrossed className="h-6 w-6 text-primary-foreground" />
          <span className="group-data-[collapsible=icon]:hidden">
            Sazón Fácil
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive('/')}
              tooltip="Descubrir"
            >
              <Link href="/">
                <Search />
                <span>Descubrir Recetas</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive('/pantry-search')}
              tooltip="Despensa"
            >
              <Link href="/pantry-search">
                <Archive />
                <span>Búsqueda en Despensa</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive('/meal-planner')}
              tooltip="Planificador"
            >
              <Link href="/meal-planner">
                <Calendar />
                <span>Planificador de Comidas</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive('/upload-recipe')}
              tooltip="Subir"
            >
              <Link href="/upload-recipe">
                <Upload />
                <span>Subir Receta</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive('/profile')}
              tooltip="Favoritos"
            >
              <Link href="/profile">
                <Heart />
                <span>Mis Favoritos</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Ajustes">
              <Settings />
              <span>Ajustes</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
