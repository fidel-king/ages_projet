'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Filter, Download, Upload } from 'lucide-react';
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
import { DataTable } from '@/components/shared/data-table';
import { AuditeurForm } from '@/components/forms/auditeur-form';
import { useAuditeurs, useGroupes } from '@/lib/hooks/use-store';
import type { Auditeur } from '@/lib/types';

export default function AuditeursPage() {
  const router = useRouter();
  const { auditeurs, add, refresh } = useAuditeurs();
  const { groupes } = useGroupes();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterGroupe, setFilterGroupe] = useState<string>('all');
  const [filterSexe, setFilterSexe] = useState<string>('all');

  const filteredAuditeurs = useMemo(() => {
    return auditeurs.filter((a) => {
      if (filterGroupe !== 'all' && a.groupeId !== filterGroupe) return false;
      if (filterSexe !== 'all' && a.sexe !== filterSexe) return false;
      return true;
    });
  }, [auditeurs, filterGroupe, filterSexe]);

  const getGroupeName = (groupeId: string) => {
    const groupe = groupes.find((g) => g.id === groupeId);
    return groupe ? groupe.nom : 'Non assigne';
  };

  const columns = [
    { key: 'matricule', header: 'Matricule' },
    {
      key: 'nom',
      header: 'Nom complet',
      render: (auditeur: Auditeur) => (
        <span className="font-medium">
          {auditeur.prenom} {auditeur.nom}
        </span>
      ),
    },
    {
      key: 'sexe',
      header: 'Sexe',
      render: (auditeur: Auditeur) => (
        <Badge variant="outline">{auditeur.sexe === 'M' ? 'Homme' : 'Femme'}</Badge>
      ),
    },
    {
      key: 'groupeId',
      header: 'Groupe',
      render: (auditeur: Auditeur) => getGroupeName(auditeur.groupeId),
    },
    { key: 'departement', header: 'Departement' },
    {
      key: 'actif',
      header: 'Statut',
      render: (auditeur: Auditeur) => (
        <Badge variant={auditeur.actif ? 'default' : 'secondary'}>
          {auditeur.actif ? 'Actif' : 'Inactif'}
        </Badge>
      ),
    },
  ];

  const handleSubmit = (data: Omit<Auditeur, 'id' | 'matricule' | 'dateInscription'>) => {
    add(data);
    setIsDialogOpen(false);
    refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Auditeurs</h1>
          <p className="text-muted-foreground">
            Gestion des {auditeurs.length} auditeurs inscrits
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 size-4" />
              Nouvel auditeur
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ajouter un auditeur</DialogTitle>
              <DialogDescription>
                Remplissez les informations pour inscrire un nouvel auditeur
              </DialogDescription>
            </DialogHeader>
            <AuditeurForm onSubmit={handleSubmit} onCancel={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Liste des auditeurs</CardTitle>
              <CardDescription>
                {filteredAuditeurs.length} auditeur(s) affiche(s)
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={filterGroupe} onValueChange={setFilterGroupe}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 size-4" />
                  <SelectValue placeholder="Tous les groupes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les groupes</SelectItem>
                  {groupes.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterSexe} onValueChange={setFilterSexe}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sexe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="M">Hommes</SelectItem>
                  <SelectItem value="F">Femmes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredAuditeurs}
            columns={columns}
            searchPlaceholder="Rechercher par nom..."
            searchKey="nom"
            onRowClick={(auditeur) => router.push(`/dashboard/auditeurs/${auditeur.id}`)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
