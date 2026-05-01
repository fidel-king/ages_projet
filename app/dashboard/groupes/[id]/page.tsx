'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Edit, Users, Clock, MapPin, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DataTable } from '@/components/shared/data-table';
import { GroupeForm } from '@/components/forms/groupe-form';
import { useGroupes, useFormateurs, useSalles, useAuditeurs } from '@/lib/hooks/use-store';
import type { Groupe, Auditeur } from '@/lib/types';

export default function GroupeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { getById, update, refresh } = useGroupes();
  const { formateurs } = useFormateurs();
  const { salles } = useSalles();
  const { auditeurs } = useAuditeurs();
  
  const [groupe, setGroupe] = useState<Groupe | undefined>();
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    const id = params.id as string;
    const found = getById(id);
    setGroupe(found);
  }, [params.id, getById]);

  if (!groupe) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Groupe non trouve</p>
      </div>
    );
  }

  const formateur = formateurs.find((f) => f.id === groupe.formateurId);
  const salle = salles.find((s) => s.id === groupe.salleId);
  const groupeAuditeurs = auditeurs.filter((a) => a.groupeId === groupe.id);

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

  const handleUpdate = (data: Omit<Groupe, 'id' | 'matricule'>) => {
    update(groupe.id, data);
    refresh();
    setGroupe({ ...groupe, ...data });
    setIsEditOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{groupe.nom}</h1>
            <Badge variant={groupe.actif ? 'default' : 'secondary'}>
              {groupe.actif ? 'Actif' : 'Inactif'}
            </Badge>
          </div>
          <p className="text-muted-foreground">{groupe.matricule}</p>
        </div>
        <Button variant="outline" onClick={() => setIsEditOpen(true)}>
          <Edit className="mr-2 size-4" />
          Modifier
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <Clock className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Horaire</p>
                <p className="font-medium">{groupe.jourPassage}</p>
                <p className="text-sm">{groupe.heureDebut} - {groupe.heureFin}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <GraduationCap className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Formateur</p>
                <p className="font-medium">
                  {formateur ? `${formateur.prenom} ${formateur.nom}` : 'Non assigne'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <MapPin className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Salle</p>
                <p className="font-medium">{salle?.nom || 'Non assignee'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <Users className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Effectif</p>
                <p className="font-medium">
                  {groupeAuditeurs.length}/{groupe.capaciteMax}
                </p>
                <Badge variant="secondary" className="mt-1">{groupe.niveau}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Auditeurs du groupe</CardTitle>
          <CardDescription>
            {groupeAuditeurs.length} auditeur(s) inscrit(s) dans ce groupe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={groupeAuditeurs}
            columns={columns}
            searchPlaceholder="Rechercher un auditeur..."
            searchKey="nom"
            onRowClick={(auditeur) => router.push(`/dashboard/auditeurs/${auditeur.id}`)}
          />
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier le groupe</DialogTitle>
            <DialogDescription>
              Modifiez les parametres du groupe
            </DialogDescription>
          </DialogHeader>
          <GroupeForm
            groupe={groupe}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
