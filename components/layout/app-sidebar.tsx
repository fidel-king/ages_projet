'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  UsersRound,
  DoorOpen,
  ClipboardCheck,
  Calendar,
  FileBarChart,
  Settings,
  LogOut,
  BookOpen,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/lib/hooks/use-store';
import type { UserRole } from '@/lib/types';

const menuItems = [
  {
    title: 'Tableau de bord',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['admin', 'formateur', 'superviseur', 'direction'] as UserRole[],
  },
  {
    title: 'Auditeurs',
    href: '/dashboard/auditeurs',
    icon: Users,
    roles: ['admin', 'formateur', 'superviseur', 'direction'] as UserRole[],
  },
  {
    title: 'Formateurs',
    href: '/dashboard/formateurs',
    icon: GraduationCap,
    roles: ['admin', 'superviseur', 'direction'] as UserRole[],
  },
  {
    title: 'Groupes',
    href: '/dashboard/groupes',
    icon: UsersRound,
    roles: ['admin', 'formateur', 'superviseur', 'direction'] as UserRole[],
  },
  {
    title: 'Salles',
    href: '/dashboard/salles',
    icon: DoorOpen,
    roles: ['admin', 'superviseur'] as UserRole[],
  },
  {
    title: 'Presences',
    href: '/dashboard/presences',
    icon: ClipboardCheck,
    roles: ['admin', 'formateur', 'superviseur', 'direction'] as UserRole[],
  },
  {
    title: 'Planning',
    href: '/dashboard/planning',
    icon: Calendar,
    roles: ['admin', 'formateur', 'superviseur', 'direction'] as UserRole[],
  },
  {
    title: 'Rapports',
    href: '/dashboard/rapports',
    icon: FileBarChart,
    roles: ['admin', 'superviseur', 'direction'] as UserRole[],
  },
  {
    title: 'Parametres',
    href: '/dashboard/parametres',
    icon: Settings,
    roles: ['admin'] as UserRole[],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const filteredMenuItems = menuItems.filter(
    (item) => !user || item.roles.includes(user.role)
  );

  const handleLogout = () => {
    logout();
    window.location.href = '/auth';
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <BookOpen className="size-5" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold text-sidebar-foreground">
              AGES
            </span>
            <span className="text-xs text-sidebar-foreground/70">
              Academie SAG
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/dashboard' && pathname.startsWith(item.href));
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                      <Link href={item.href}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator />
        {user && (
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="flex items-center gap-3 px-2 py-2 group-data-[collapsible=icon]:justify-center">
                <Avatar className="size-8">
                  <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-xs">
                    {user.prenom[0]}
                    {user.nom[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                  <span className="text-sm font-medium text-sidebar-foreground">
                    {user.prenom} {user.nom}
                  </span>
                  <span className="text-xs text-sidebar-foreground/70 capitalize">
                    {user.role}
                  </span>
                </div>
              </div>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout} tooltip="Deconnexion">
                <LogOut className="size-4" />
                <span>Deconnexion</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
