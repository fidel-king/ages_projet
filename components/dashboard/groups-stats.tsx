'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useStatistiques } from '@/lib/hooks/use-store';
import { APP_CONFIG } from '@/lib/data/constants';

export function GroupsStats() {
  const { statsParGroupe } = useStatistiques();

  // Trier par taux de presence croissant pour montrer les groupes en difficulte
  const sortedGroups = [...statsParGroupe]
    .filter((g) => g.total > 0)
    .sort((a, b) => a.taux - b.taux)
    .slice(0, 8);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance des groupes</CardTitle>
        <CardDescription>
          Taux de presence par groupe (objectif : {APP_CONFIG.tauxPresenceAlerte}%)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[260px] pr-4">
          <div className="space-y-4">
            {sortedGroups.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Aucune donnee de presence disponible
              </p>
            ) : (
              sortedGroups.map((groupe) => (
                <div key={groupe.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{groupe.nom}</span>
                    <Badge
                      variant={
                        groupe.taux >= APP_CONFIG.tauxPresenceAlerte
                          ? 'default'
                          : groupe.taux >= 50
                          ? 'secondary'
                          : 'destructive'
                      }
                    >
                      {groupe.taux}%
                    </Badge>
                  </div>
                  <Progress
                    value={groupe.taux}
                    className="h-2"
                  />
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
