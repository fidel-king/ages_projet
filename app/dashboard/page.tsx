'use client';

import { StatsCards } from '@/components/dashboard/stats-cards';
import { PresenceChart } from '@/components/dashboard/presence-chart';
import { GroupsStats } from '@/components/dashboard/groups-stats';
import { RecentActivity } from '@/components/dashboard/recent-activity';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Vue d&apos;ensemble de l&apos;activite de l&apos;Academie
        </p>
      </div>

      <StatsCards />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <PresenceChart />
        <GroupsStats />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <RecentActivity />
      </div>
    </div>
  );
}
