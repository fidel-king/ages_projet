'use client';

import { Users, UserCheck, UserX, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStatistiques } from '@/lib/hooks/use-store';

export function StatsCards() {
  const { stats } = useStatistiques();

  const cards = [
    {
      title: 'Total Auditeurs',
      value: stats.totalAuditeurs,
      description: 'Auditeurs actifs inscrits',
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Presents Aujourd\'hui',
      value: stats.presentsAujourdhui,
      description: `${stats.retardsAujourdhui} retard(s) inclus`,
      icon: UserCheck,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Absents Aujourd\'hui',
      value: stats.absentsAujourdhui,
      description: 'Absences enregistrees',
      icon: UserX,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    {
      title: 'Taux de Presence',
      value: `${stats.tauxPresenceGlobal}%`,
      description: stats.tauxPresenceSemaine >= stats.tauxPresenceGlobal ? 'En hausse cette semaine' : 'En baisse cette semaine',
      icon: stats.tauxPresenceSemaine >= stats.tauxPresenceGlobal ? TrendingUp : TrendingDown,
      color: stats.tauxPresenceGlobal >= 70 ? 'text-success' : 'text-warning',
      bgColor: stats.tauxPresenceGlobal >= 70 ? 'bg-success/10' : 'bg-warning/10',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`rounded-lg p-2 ${card.bgColor}`}>
              <card.icon className={`size-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
