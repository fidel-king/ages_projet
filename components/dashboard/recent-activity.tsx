'use client';

import { useMemo } from 'react';
import { Calendar, Users, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useGroupes, useFormateurs, useSalles } from '@/lib/hooks/use-store';
import { JOURS_PASSAGE } from '@/lib/data/constants';

export function RecentActivity() {
  const { groupes } = useGroupes();
  const { formateurs } = useFormateurs();
  const { salles } = useSalles();

  // Obtenir le jour actuel en francais
  const today = useMemo(() => {
    const jourIndex = new Date().getDay();
    const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    return jours[jourIndex];
  }, []);

  // Filtrer les groupes du jour
  const groupesDuJour = useMemo(() => {
    return groupes
      .filter((g) => g.jourPassage === today && g.actif)
      .sort((a, b) => a.heureDebut.localeCompare(b.heureDebut));
  }, [groupes, today]);

  const getFormateurName = (formateurId: string) => {
    const formateur = formateurs.find((f) => f.id === formateurId);
    return formateur ? `${formateur.prenom} ${formateur.nom}` : 'Non assigne';
  };

  const getSalleName = (salleId: string) => {
    const salle = salles.find((s) => s.id === salleId);
    return salle ? salle.nom : 'Non assignee';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="size-5" />
          Cours du jour
        </CardTitle>
        <CardDescription>
          {today} - {groupesDuJour.length} groupe(s) prevu(s)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[260px] pr-4">
          {groupesDuJour.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Calendar className="size-12 text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">
                Aucun cours prevu aujourd&apos;hui
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {groupesDuJour.map((groupe) => (
                <div
                  key={groupe.id}
                  className="flex items-start gap-3 rounded-lg border p-3"
                >
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Users className="size-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{groupe.nom}</p>
                      <Badge variant="outline" className="text-xs">
                        {getSalleName(groupe.salleId)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {getFormateurName(groupe.formateurId)}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="size-3" />
                      {groupe.heureDebut} - {groupe.heureFin}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
