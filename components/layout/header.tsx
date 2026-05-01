'use client';

import { usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAlertes } from '@/lib/hooks/use-store';

const pathNames: Record<string, string> = {
  dashboard: 'Tableau de bord',
  auditeurs: 'Auditeurs',
  formateurs: 'Formateurs',
  groupes: 'Groupes',
  salles: 'Salles',
  presences: 'Presences',
  planning: 'Planning',
  rapports: 'Rapports',
  parametres: 'Parametres',
};

export function Header() {
  const pathname = usePathname();
  const { nonLues } = useAlertes();
  
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const label = pathNames[segment] || segment;
    const isLast = index === segments.length - 1;
    
    return { href, label, isLast };
  });

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      
      <Breadcrumb className="flex-1">
        <BreadcrumbList>
          {breadcrumbs.map((crumb, index) => (
            <BreadcrumbItem key={crumb.href}>
              {index > 0 && <BreadcrumbSeparator />}
              {crumb.isLast ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-4" />
          {nonLues.length > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 size-5 rounded-full p-0 flex items-center justify-center text-[10px]"
            >
              {nonLues.length}
            </Badge>
          )}
        </Button>
      </div>
    </header>
  );
}
