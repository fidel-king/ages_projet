'use client';

import { useState, useMemo } from 'react';
import { CalendarIcon, Check, X, Clock, Save } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Toggle } from '@/components/ui/toggle';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { useGroupes, useAuditeurs, usePresences, useAuth } from '@/lib/hooks/use-store';
import type { PresenceStatut } from '@/lib/types';

export default function PresencesPage() {
  const { user } = useAuth();
  const { groupes } = useGroupes();
  const { auditeurs } = useAuditeurs();
  const { getByDateAndGroupe, saveBatch, refresh } = usePresences();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedGroupeId, setSelectedGroupeId] = useState<string>('');
  const [presenceData, setPresenceData] = useState<Record<string, PresenceStatut>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  
  // Filtrer les groupes pour le jour selectionne
  const jourSemaine = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'][selectedDate.getDay()];
  const groupesDuJour = useMemo(() => {
    return groupes.filter((g) => g.jourPassage === jourSemaine && g.actif);
  }, [groupes, jourSemaine]);

  // Auditeurs du groupe selectionne
  const groupeAuditeurs = useMemo(() => {
    if (!selectedGroupeId) return [];
    return auditeurs.filter((a) => a.groupeId === selectedGroupeId && a.actif);
  }, [auditeurs, selectedGroupeId]);

  // Charger les presences existantes quand le groupe ou la date change
  useMemo(() => {
    if (!selectedGroupeId || !dateStr) return;
    
    const existingPresences = getByDateAndGroupe(dateStr, selectedGroupeId);
    const data: Record<string, PresenceStatut> = {};
    
    existingPresences.forEach((p) => {
      data[p.auditeurId] = p.statut;
    });
    
    setPresenceData(data);
    setSaved(false);
  }, [selectedGroupeId, dateStr, getByDateAndGroupe]);

  const handlePresenceChange = (auditeurId: string, statut: PresenceStatut) => {
    setPresenceData((prev) => ({
      ...prev,
      [auditeurId]: statut,
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    if (!user || !selectedGroupeId) return;
    
    setSaving(true);
    
    const presencesToSave = groupeAuditeurs.map((auditeur) => ({
      date: dateStr,
      auditeurId: auditeur.id,
      groupeId: selectedGroupeId,
      statut: presenceData[auditeur.id] || 'absent',
      saisieParId: user.id,
    }));
    
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    saveBatch(presencesToSave);
    refresh();
    
    setSaving(false);
    setSaved(true);
  };

  const stats = useMemo(() => {
    const total = groupeAuditeurs.length;
    const presents = Object.values(presenceData).filter((s) => s === 'present').length;
    const absents = Object.values(presenceData).filter((s) => s === 'absent').length;
    const retards = Object.values(presenceData).filter((s) => s === 'retard').length;
    const nonRenseignes = total - presents - absents - retards;
    
    return { total, presents, absents, retards, nonRenseignes };
  }, [groupeAuditeurs, presenceData]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Saisie des presences</h1>
        <p className="text-muted-foreground">
          Enregistrez les presences des auditeurs par groupe et par date
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 size-4" />
              {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Select value={selectedGroupeId} onValueChange={setSelectedGroupeId}>
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder="Selectionner un groupe" />
          </SelectTrigger>
          <SelectContent>
            {groupesDuJour.length === 0 ? (
              <div className="p-2 text-sm text-muted-foreground">
                Aucun groupe prevu ce jour
              </div>
            ) : (
              groupesDuJour.map((g) => (
                <SelectItem key={g.id} value={g.id}>
                  {g.nom} ({g.heureDebut} - {g.heureFin})
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        {selectedGroupeId && (
          <Button onClick={handleSave} disabled={saving || stats.nonRenseignes > 0}>
            {saving ? (
              <Spinner className="mr-2 size-4" />
            ) : saved ? (
              <Check className="mr-2 size-4" />
            ) : (
              <Save className="mr-2 size-4" />
            )}
            {saved ? 'Enregistre' : 'Enregistrer'}
          </Button>
        )}
      </div>

      {selectedGroupeId && (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{stats.presents}</p>
                  <p className="text-sm text-muted-foreground">Presents</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{stats.absents}</p>
                  <p className="text-sm text-muted-foreground">Absents</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">{stats.retards}</p>
                  <p className="text-sm text-muted-foreground">Retards</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Feuille de presence</CardTitle>
              <CardDescription>
                Cliquez sur les boutons pour marquer la presence de chaque auditeur
              </CardDescription>
            </CardHeader>
            <CardContent>
              {groupeAuditeurs.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Aucun auditeur dans ce groupe
                </p>
              ) : (
                <div className="space-y-2">
                  {groupeAuditeurs.map((auditeur) => {
                    const statut = presenceData[auditeur.id];
                    
                    return (
                      <div
                        key={auditeur.id}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div>
                          <p className="font-medium">
                            {auditeur.prenom} {auditeur.nom}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {auditeur.matricule} - {auditeur.departement}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Toggle
                            pressed={statut === 'present'}
                            onPressedChange={() => handlePresenceChange(auditeur.id, 'present')}
                            className={cn(
                              'data-[state=on]:bg-green-500 data-[state=on]:text-white'
                            )}
                          >
                            <Check className="size-4" />
                          </Toggle>
                          <Toggle
                            pressed={statut === 'retard'}
                            onPressedChange={() => handlePresenceChange(auditeur.id, 'retard')}
                            className={cn(
                              'data-[state=on]:bg-yellow-500 data-[state=on]:text-white'
                            )}
                          >
                            <Clock className="size-4" />
                          </Toggle>
                          <Toggle
                            pressed={statut === 'absent'}
                            onPressedChange={() => handlePresenceChange(auditeur.id, 'absent')}
                            className={cn(
                              'data-[state=on]:bg-red-500 data-[state=on]:text-white'
                            )}
                          >
                            <X className="size-4" />
                          </Toggle>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {!selectedGroupeId && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <CalendarIcon className="mx-auto size-12 mb-4 opacity-50" />
              <p>Selectionnez une date et un groupe pour commencer la saisie des presences</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
