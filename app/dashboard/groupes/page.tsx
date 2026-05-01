'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Filter, Users, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { GroupeForm } from '@/components/forms/groupe-form';
import { useGroupes, useFormateurs, useSalles, useAuditeurs } from '@/lib/hooks/use-store';
import { JOURS_PASSAGE } from '@/lib/data/constants';
import type { Groupe } from '@/lib/types';

export default function GroupesPage() {
  const router = useRouter();
  const { groupes, add, refresh } = useGroupes();
  const { formateurs } = useFormateurs();
  const { salles } = useSalles();
  const { auditeurs } = useAuditeurs();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterJour, setFilterJour] = useState<string>('all');

  const filteredGroupes = useMemo(() => {
    if (filterJour === 'all') return groupes;
    return groupes.filter((g) => g.jourPassage === filterJour);
  }, [groupes, filterJour]);

  const getFormateurName = (formateurId: string) => {
    const formateur = formateurs.find((f) => f.id === formateurId);
    return formateur ? `${formateur.prenom} ${formateur.nom}` : 'Non assigne';
  };

  const getSalleName = (salleId: string) => {
    const salle = salles.find((s) => s.id === salleId);
    return salle ? salle.nom : 'Non assignee';
  };

  const getAuditeursCount = (groupeId: string) => {
    return auditeurs.filter((a) => a.groupeId === groupeId).length;
  };

  const handleSubmit = (data: Omit<Groupe, 'id' | 'matricule'>) => {
    add(data);
    setIsDialogOpen(false);
    refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Groupes</h1>
          <p className="text-muted-foreground">
            Gestion des {groupes.length} groupes pedagogiques
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 size-4" />
              Nouveau groupe
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Creer un groupe</DialogTitle>
              <DialogDescription>
                Configurez les parametres du nouveau groupe
              </DialogDescription>
            </DialogHeader>
            <GroupeForm onSubmit={handleSubmit} onCancel={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <Select value={filterJour} onValueChange={setFilterJour}>
          <SelectTrigger className="w-[200px]">
            <Filter className="mr-2 size-4" />
            <SelectValue placeholder="Filtrer par jour" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les jours</SelectItem>
            {JOURS_PASSAGE.map((jour) => (
              <SelectItem key={jour} value={jour}>
                {jour}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          {filteredGroupes.length} groupe(s) affiche(s)
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredGroupes.map((groupe) => (
          <Card 
            key={groupe.id} 
            className="cursor-pointer transition-shadow hover:shadow-md"
            onClick={() => router.push(`/dashboard/groupes/${groupe.id}`)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{groupe.nom}</CardTitle>
                <Badge variant={groupe.actif ? 'default' : 'secondary'}>
                  {groupe.actif ? 'Actif' : 'Inactif'}
                </Badge>
              </div>
              <CardDescription>{groupe.matricule}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <Badge variant="outline">{groupe.jourPassage}</Badge>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="size-3" />
                    {groupe.heureDebut} - {groupe.heureFin}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="size-4 text-muted-foreground" />
                    <span>{getFormateurName(groupe.formateurId)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-muted-foreground" />
                    <span>{getSalleName(groupe.salleId)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <Badge variant="secondary">{groupe.niveau}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {getAuditeursCount(groupe.id)}/{groupe.capaciteMax} auditeurs
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
