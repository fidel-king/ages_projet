'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Users, MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useGroupes, useFormateurs, useSalles } from '@/lib/hooks/use-store';
import { JOURS_PASSAGE, HORAIRES } from '@/lib/data/constants';

export default function PlanningPage() {
  const router = useRouter();
  const { groupes } = useGroupes();
  const { formateurs } = useFormateurs();
  const { salles } = useSalles();

  const getFormateurName = (formateurId: string) => {
    const formateur = formateurs.find((f) => f.id === formateurId);
    return formateur ? `${formateur.prenom} ${formateur.nom}` : 'Non assigne';
  };

  const getSalleName = (salleId: string) => {
    const salle = salles.find((s) => s.id === salleId);
    return salle ? salle.nom : '-';
  };

  // Organiser les groupes par jour et heure
  const planningData = useMemo(() => {
    const data: Record<string, Record<string, typeof groupes>> = {};
    
    JOURS_PASSAGE.forEach((jour) => {
      data[jour] = {};
      HORAIRES.debut.forEach((heure) => {
        data[jour][heure] = [];
      });
    });
    
    groupes.forEach((groupe) => {
      if (data[groupe.jourPassage] && data[groupe.jourPassage][groupe.heureDebut]) {
        data[groupe.jourPassage][groupe.heureDebut].push(groupe);
      }
    });
    
    return data;
  }, [groupes]);

  // Obtenir le jour actuel
  const today = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'][new Date().getDay()];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Planning hebdomadaire</h1>
        <p className="text-muted-foreground">
          Vue d&apos;ensemble des cours de la semaine
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Emploi du temps</CardTitle>
          <CardDescription>
            Cliquez sur un groupe pour voir les details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full">
            <div className="min-w-[900px]">
              {/* En-tete avec les jours */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                <div className="p-2 text-sm font-medium text-muted-foreground">
                  Horaire
                </div>
                {JOURS_PASSAGE.map((jour) => (
                  <div
                    key={jour}
                    className={`p-2 text-center text-sm font-medium rounded-lg ${
                      jour === today ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}
                  >
                    {jour}
                  </div>
                ))}
              </div>

              {/* Grille du planning */}
              <div className="space-y-2">
                {HORAIRES.debut.map((heure, idx) => (
                  <div key={heure} className="grid grid-cols-7 gap-2">
                    <div className="p-2 text-sm text-muted-foreground flex items-center">
                      <Clock className="size-3 mr-1" />
                      {heure} - {HORAIRES.fin[idx]}
                    </div>
                    {JOURS_PASSAGE.map((jour) => {
                      const groupesSlot = planningData[jour][heure] || [];
                      
                      return (
                        <div key={`${jour}-${heure}`} className="min-h-[80px]">
                          {groupesSlot.length === 0 ? (
                            <div className="h-full rounded-lg border border-dashed border-muted flex items-center justify-center">
                              <span className="text-xs text-muted-foreground">-</span>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              {groupesSlot.map((groupe) => (
                                <div
                                  key={groupe.id}
                                  onClick={() => router.push(`/dashboard/groupes/${groupe.id}`)}
                                  className="rounded-lg border bg-card p-2 cursor-pointer hover:bg-accent transition-colors"
                                >
                                  <p className="font-medium text-sm truncate">
                                    {groupe.nom}
                                  </p>
                                  <div className="mt-1 space-y-0.5">
                                    <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                                      <Users className="size-3" />
                                      {getFormateurName(groupe.formateurId)}
                                    </p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                      <MapPin className="size-3" />
                                      {getSalleName(groupe.salleId)}
                                    </p>
                                  </div>
                                  <Badge variant="secondary" className="mt-1 text-[10px]">
                                    {groupe.niveau}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Legende */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Legende</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="size-4 rounded bg-primary" />
              <span>Jour actuel</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-4 rounded border bg-card" />
              <span>Cours programme</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-4 rounded border border-dashed" />
              <span>Pas de cours</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
